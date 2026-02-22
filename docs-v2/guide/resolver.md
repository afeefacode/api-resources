# Resolver

## Überblick

Resolver trennen die **Definition** einer API (Types, Fields, Actions) von der **Implementierung** (Daten laden, berechnen, speichern). Es gibt drei Ebenen:

| Ebene | Resolver-Typ | Zweck |
|-------|-------------|-------|
| **Attribute** | `QueryAttributeResolver` | Berechnete/abgeleitete Felder |
| **Relation** | `QueryRelationResolver` | Custom-Logik für Relationen |
| **Action** | `QueryActionResolver` / `MutationActionResolver` | Custom Actions auf Resources |

::: info Auto-Resolver
`V2\ModelType` registriert automatisch Eloquent-Resolver für alle Relationen, die keinen expliziten Resolver haben. Du musst nur dann `->resolve()` angeben, wenn die Standard-Logik nicht reicht.
:::

## Attribute-Resolver

Für berechnete Felder, die nicht direkt in der Datenbank stehen (z.B. Kosten, Statistiken, aggregierte Werte).

### Grundstruktur

```php
// Im Type
$fields
    ->number('estimated_cost')->on(READ)
        ->resolve([OrderCostResolver::class, 'resolve_estimated_cost']);
```

```php
// Resolver-Klasse
class OrderCostResolver
{
    public function resolve_estimated_cost(
        QueryAttributeResolver $r,
        ContainerInterface $container
    ) {
        $calculator = $container->get(OrderPriceCalculator::class);

        $r
            ->get(function (array $owners) use ($calculator) {
                // Batch: Alle Owners auf einmal verarbeiten (N+1 Prevention)
                $ids = array_map(fn ($o) => $o->id, $owners);

                $orders = Order::with($calculator->getEagerLoadedRelations())
                    ->whereIn('id', $ids)
                    ->get();

                $costs = [];
                foreach ($orders as $order) {
                    $costs[$order->id] = $calculator->calculatePrice($order);
                }
                return $costs;
            })

            ->map(function (array $costs, Model $owner) {
                // Pro Owner den passenden Wert zuordnen
                return $costs[$owner->id] ?? 0;
            });
    }
}
```

### Methoden-Signatur

Die Resolver-Methode bekommt ihre Parameter per Dependency Injection:

```php
public function resolve_xyz(QueryAttributeResolver $r, ContainerInterface $container)
```

- **Erster Parameter**: Immer der Resolver (wird frisch erstellt)
- **Weitere Parameter**: Singletons aus dem DI-Container (optional)

### `get()` + `map()` — Batch-Pattern

Das Standard-Pattern für Attribute-Resolver. Verhindert N+1-Queries:

```php
$r
    ->get(function (array $owners) {
        // $owners = alle Models, die dieses Feld angefordert haben
        // Gibt ein Array zurück, das in map() weiterverarbeitet wird
        $ids = array_map(fn ($o) => $o->id, $owners);
        return MyModel::whereIn('foreign_id', $ids)->get()->groupBy('foreign_id')->all();
    })

    ->map(function (array $results, Model $owner) {
        // Wird pro Owner aufgerufen
        // Rückgabewert wird als Attribut-Wert auf den Owner gesetzt
        return count($results[$owner->id] ?? []);
    });
```

::: tip Ablauf
1. `get()` wird **einmal** für alle Owners aufgerufen (Batch-Query)
2. `map()` wird **pro Owner** aufgerufen und setzt den Wert
:::

### `select()` — Leichtgewichtige Alternative

Wenn der Wert nur aus bereits geladenen DB-Spalten berechnet werden kann, ohne Extra-Query:

```php
$r->select(['first_name', 'last_name'], function (Model $owner) {
    return $owner->first_name . ' ' . $owner->last_name;
});
```

- Erster Parameter: Welche DB-Spalten der Owner braucht (werden in den SELECT aufgenommen)
- Zweiter Parameter: Callback pro Owner, gibt den berechneten Wert zurück

### Resolver mit Parametern

```php
// Im Type
->number('total_with_tax')->on(READ)
    ->resolve([CostResolver::class, 'resolve_cost'], ['include_tax' => true])
```

```php
// Resolver
public function resolve_cost(QueryAttributeResolver $r, ContainerInterface $container)
{
    $params = $r->getParams(); // ['include_tax' => true]
    // ...
}
```

### Direkt auf Owners schreiben

Der `get()`-Callback kann auch direkt mehrere Attribute auf den Owners setzen:

```php
$r->get(function (array $owners) {
    $ids = array_map(fn ($o) => $o->id, $owners);

    $stats = DB::table('orders')
        ->selectRaw('debitor_id, SUM(cost) as total, COUNT(*) as count')
        ->whereIn('debitor_id', $ids)
        ->groupBy('debitor_id')
        ->get()->keyBy('debitor_id');

    // Direkt auf Owners setzen — kein map() nötig
    foreach ($owners as $owner) {
        $s = $stats[$owner->id] ?? null;
        $owner->apiResourcesSetAttribute('total_cost', $s?->total ?? 0);
        $owner->apiResourcesSetAttribute('order_count', $s?->count ?? 0);
    }

    return [];
});
```

::: warning
Wenn du direkt via `apiResourcesSetAttribute()` schreibst, brauchst du kein `map()`. Das `get()`-Ergebnis wird dann ignoriert.
:::

---

## Relation-Resolver

Für Relationen, die nicht über Standard-Eloquent-Beziehungen geladen werden können.

### Grundstruktur

```php
// Im Type
->hasOne('primary_contact', PersonType::class)->on(READ)
    ->resolve([CustomerResolver::class, 'resolve_primary_contact'])
```

```php
// Resolver-Klasse
class CustomerResolver
{
    public function resolve_primary_contact(QueryRelationResolver $r)
    {
        $r
            ->ownerIdFields(['institution_id'])

            ->get(function (
                array $owners,
                Closure $getSelectFields,
                Closure $getRequestedFieldNames
            ) {
                $institutionIds = array_map(fn ($o) => $o->institution_id, $owners);

                $contacts = InstitutionContact::with('person')
                    ->select($getSelectFields())
                    ->whereIn('institution_id', $institutionIds)
                    ->where('is_primary', true)
                    ->get();

                return $contacts->all();
            })

            ->map(function (array $contacts, Model $owner) {
                foreach ($contacts as $contact) {
                    if ($contact->institution_id === $owner->institution_id) {
                        return $contact;
                    }
                }
                return null;
            });
    }
}
```

### `ownerIdFields()`

Teilt dem Framework mit, welche DB-Spalten vom Owner-Model benötigt werden, um die Relation aufzulösen:

```php
$r->ownerIdFields(['institution_id'])
```

Diese Felder werden automatisch in den SELECT des Owner-Queries aufgenommen.

### `getSelectFields` und `getRequestedFieldNames`

Die `get()`-Closure bekommt Hilfsfunktionen für optimierte Queries:

```php
->get(function (array $owners, Closure $getSelectFields, Closure $getRequestedFieldNames) {
    // $getSelectFields() → ['id', 'name', 'email'] (für SELECT)
    // $getRequestedFieldNames() → ['id', 'name', 'email'] (was der Client angefragt hat)

    return Model::select($getSelectFields())->where(...)->get()->all();
})
```

### hasOne vs hasMany

| Relation | `get()` gibt zurück | `map()` gibt zurück |
|----------|---------------------|---------------------|
| `hasOne` | Flaches Array `[model, model, ...]` | Ein einzelnes Model oder `null` |
| `hasMany` | Verschachteltes Array `[[m1, m2], [m3], []]` | Ein Array von Models |

### hasMany Beispiel

```php
->hasMany('recent_orders', OrderType::class)->on(READ)
    ->resolve([SprintResolver::class, 'resolve_recent_orders'])
```

```php
public function resolve_recent_orders(QueryRelationResolver $r)
{
    $r->get(function (array $owners, Closure $getSelectFields) {
        $ids = array_map(fn ($o) => $o->id, $owners);

        $orders = Order::select($getSelectFields())
            ->whereIn('sprint_id', $ids)
            ->orderByDesc('date')
            ->limit(5)
            ->get()
            ->groupBy('sprint_id');

        // Verschachteltes Array: pro Owner ein Array von Orders
        return array_map(
            fn ($owner) => ($orders[$owner->id] ?? collect())->all(),
            $owners
        );
    });

    // Kein map() nötig — das verschachtelte Array wird direkt zugeordnet
}
```

---

## Action-Resolver

Actions auf Resources haben standardmäßig automatische Resolver (CRUD). Für Custom Actions oder abweichende Logik definierst du eigene.

### Query-Action (Lesen)

```php
class OrderResource extends ModelResource
{
    protected function actions(ActionBag $actions): void
    {
        parent::actions($actions);

        // Custom Query-Action
        $actions->query(
            'sprint_other_orders',
            Type::list(OrderType::class),
            function (Action $action) {
                $action
                    ->params(function (ActionParams $params) {
                        $params
                            ->string('order_id')
                            ->string('sprint_ids');
                    })

                    ->resolve(function (QueryActionResolver $r) {
                        $r->get(function (
                            ApiRequest $request,
                            Closure $getSelectFields
                        ) {
                            $order = Order::find($request->getParam('order_id'));
                            $sprintIds = explode(',', $request->getParam('sprint_ids'));

                            $orders = Order::select($getSelectFields())
                                ->whereIn('sprint_id', $sprintIds)
                                ->where('date', $order->date)
                                ->where('id', '!=', $order->id)
                                ->get()->all();

                            return (new ActionResult())->data($orders);
                        });
                    });
            }
        );
    }
}
```

### Query-Action: `get()` Callback

Der `get()`-Callback bekommt:

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$request` | `ApiRequest` | Enthält Params, Filter, Fields |
| `$getSelectFields` | `Closure` | Gibt optimierte SELECT-Spalten zurück |
| `$getRequestedFieldNames` | `Closure` | Gibt angeforderte Feldnamen zurück |

```php
$r->get(function (ApiRequest $request, Closure $getSelectFields) {
    $id = $request->getParam('id');
    $selectFields = $getSelectFields();

    $model = MyModel::select($selectFields)->find($id);

    // Einzelnes Model zurückgeben
    return $model;

    // Oder: ActionResult für Meta-Daten
    return (new ActionResult())
        ->data($models)
        ->meta(['total_count' => $totalCount]);
});
```

### Query-Action mit Count (Pagination)

```php
$r
    ->get(function (ApiRequest $request, Closure $getSelectFields) {
        $page = $request->getFilter('page') ?? 1;
        $pageSize = $request->getFilter('page_size') ?? 20;

        return MyModel::select($getSelectFields())
            ->offset(($page - 1) * $pageSize)
            ->limit($pageSize)
            ->get()->all();
    })

    ->count(function (ApiRequest $request) {
        return MyModel::count();
    });
```

### Mutation-Action (Schreiben)

```php
$actions->mutation(
    'cancel_order',
    OrderType::class,
    function (Action $action) {
        $action
            ->params(function (ActionParams $params) {
                $params->string('id');
            })

            ->resolve(function (MutationActionResolver $r) {
                $r->save(function (ApiRequest $request) {
                    $order = Order::find($request->getParam('id'));

                    $order->status = 'cancelled';
                    $order->cancelled_at = now();
                    $order->save();

                    return $order; // Wird als Response zurückgegeben
                });
            });
    }
);
```

### Mutation mit Transaction

```php
$r->transaction(function (Closure $execute) {
    return DB::transaction(function () use ($execute) {
        return $execute(); // Führt save() innerhalb der Transaktion aus
    });
});

$r->save(function (ApiRequest $request, array $saveFields) {
    $model = MyModel::find($request->getParam('id'));
    $model->fill($saveFields)->save();
    return $model;
});
```

### Mutation mit Forward

Nach dem Speichern kann die Response von einer anderen Action kommen (z.B. um das gespeicherte Model mit mehr Feldern zu laden):

```php
$r->save(function (ApiRequest $request, array $saveFields) {
    $model = new MyModel();
    $model->fill($saveFields)->save();
    return $model;
});

$r->forward('get'); // Leitet zur get-Action weiter → lädt das Model mit allen angeforderten Feldern
```

---

## Resolver registrieren

### Variante 1: `[Klasse, Methode]` (empfohlen)

```php
->resolve([OrderCostResolver::class, 'resolve_estimated_cost'])
```

- Die Klasse wird per DI erstellt
- Die Methode bekommt den Resolver als ersten Parameter
- Weitere Parameter werden per DI injiziert

### Variante 2: Inline-Closure

```php
->resolve(function (QueryAttributeResolver $r) {
    $r->get(function (array $owners) {
        // ...
    });
})
```

Gut für einfache Fälle. Der Type-Hint im Parameter bestimmt den Resolver-Typ.

### Variante 3: Closure mit DI

```php
->resolve(function (QueryAttributeResolver $r, ContainerInterface $container) {
    $service = $container->get(MyService::class);
    // ...
})
```

---

## Resource-Lifecycle-Hooks (Mutations)

Neben Action-Resolvern bietet `ModelResource` Lifecycle-Hooks, die bei jeder Mutation (Create, Update, Delete) automatisch aufgerufen werden. Sie sind der Hauptmechanismus für Business-Logik bei Schreiboperationen.

### Ablauf

```text
API Request: POST /api?orders:save
  │
  ├─ beforeResolve(params, data, meta)        ← Zustand erkennen, Flags setzen
  ├─ Validierung + Sanitization
  ├─ Nested Relations auflösen
  │  └─ Pro Relation:
  │     ├─ beforeAddRelation()                ← Defaults für neue Relationen
  │     ├─ beforeUpdateRelation()
  │     └─ beforeDeleteRelation()
  ├─ beforeAdd(model, saveFields, meta)       ← Felder vor INSERT anpassen
  ├─ DB: INSERT
  ├─ afterAdd(model, saveFields, meta)        ← Defaults setzen, weitere Entities erstellen
  ├─ afterResolve(model, meta)                ← Cross-Entity-Sync, Nachberechnung
  └─ Response
```

Bei UPDATE statt CREATE werden `beforeUpdate` / `afterUpdate` statt `beforeAdd` / `afterAdd` aufgerufen.

### Hook-Übersicht

| Hook | Wann | Parameter | Return |
|------|------|-----------|--------|
| `beforeResolve` | Vor jeder Mutation | `$params, $data, $meta` | `[$params, $data]` |
| `beforeAdd` | Vor INSERT | `$model, $saveFields, $meta` | `$saveFields` |
| `afterAdd` | Nach INSERT | `$model, $saveFields, $meta` | `void` |
| `beforeUpdate` | Vor UPDATE | `$model, $saveFields, $meta` | `$saveFields` |
| `afterUpdate` | Nach UPDATE | `$model, $saveFields, $meta` | `void` |
| `beforeDelete` | Vor DELETE | `$model, $meta` | `void` |
| `afterDelete` | Nach DELETE | `$model, $meta` | `void` |
| `afterResolve` | Nach allem | `$model, $meta` | `void` |

### Das `$meta`-Objekt

`$meta` ist ein `stdClass`-Objekt, das durch alle Hooks einer einzelnen Mutation gereicht wird. Es dient als Kommunikationskanal zwischen den Hooks:

```php
protected function beforeResolve(array $params, ?array $data, stdClass $meta): array
{
    // Zustand vor der Änderung merken
    if ($data['customer_new'] ?? null) {
        $meta->newCustomer = true;
    }
    return [$params, $data];
}

protected function afterResolve(?Model $order, stdClass $meta): void
{
    // Flag aus beforeResolve auswerten
    if ($meta->newCustomer ?? false) {
        // Post-Processing für neuen Kunden
        CustomerResource::syncToOwnDebitorInstitution($order->customer);
    }
}
```

### Beispiel: Defaults setzen nach CREATE

```php
class DebitorResource extends ModelResource
{
    protected function afterAdd(Model $debitor, array $saveFields, stdClass $meta): void
    {
        // Rechnungslayout aus Config setzen
        $layoutKey = $this->sprintConfig->get('default_invoice_layout_key');
        $debitor->invoice_layout_id = InvoiceLayout::where('key', $layoutKey)->first()->id;

        $variationKey = $this->sprintConfig->get('default_invoice_variation_key');
        $debitor->invoice_variation_id = InvoiceVariation::where('key', $variationKey)->first()->id;

        $debitor->save();
    }
}
```

### Beispiel: Felder vor INSERT anpassen

```php
protected function beforeAdd(Model $order, array $saveFields, stdClass $meta): array
{
    if ($meta->newCustomer ?? false) {
        // Der Customer wurde inline erstellt — jetzt existiert er
        $customer = Customer::find($saveFields['customer_id']);
        $saveFields['orderer_id'] = $customer->institution_contacts->first()->id;
    }
    return $saveFields;
}
```

### Beispiel: Zustand vor Änderung merken

```php
protected function beforeResolve(array $params, ?array $data, stdClass $meta): array
{
    if (($params['id'] ?? null) && array_key_exists('own_debitor', $data ?? [])) {
        $customer = Customer::find($params['id']);
        $meta->previousOwnDebitorId = $customer?->own_debitor_id;
    }
    return [$params, $data];
}

protected function afterResolve(?Model $customer, stdClass $meta): void
{
    // own_debitor wurde entfernt → Debitor-Institution entkoppeln
    $previousId = $meta->previousOwnDebitorId ?? null;
    if ($previousId && !$customer?->own_debitor_id) {
        $previousDebitor = Debitor::find($previousId);
        CustomerResource::endSyncToOwnDebitorInstitution($previousDebitor);
    }
}
```

### Relation-Hooks

Wenn eine Mutation verschachtelte Relationen enthält (z.B. `hasOne('address')` mit `mode: 'save'`), werden pro Relation zusätzliche Hooks aufgerufen:

```php
protected function beforeAddRelation(
    array $data,
    string $relationName,
    string $typeName,
    array $saveFields,
    stdClass $meta
): array {
    // Default-Rolle setzen wenn ein InstitutionContact erstellt wird
    if ($relationName === 'institution_contacts') {
        $roleId = CategoryHelpers::getCategory('institution_contact_roles', 'ag')->id;
        $saveFields['role_id'] = $roleId;
    }
    return $saveFields;
}

protected function beforeUpdateRelation(
    array $data,
    string $relationName,
    ModelInterface $existingModel,
    array $saveFields,
    stdClass $meta
): array {
    // saveFields vor dem UPDATE der Relation anpassen
    return $saveFields;
}

protected function beforeDeleteRelation(
    array $data,
    string $relationName,
    ModelInterface $existingModel,
    stdClass $meta
): void {
    // Validierung vor dem Löschen einer Relation
}
```

::: tip Wann welchen Hook?
- **`beforeResolve`**: Zustand merken, Daten manipulieren bevor das Framework sie verarbeitet
- **`beforeAdd` / `beforeUpdate`**: Felder anpassen (z.B. berechnete FKs setzen)
- **`afterAdd`**: Defaults aus Config setzen, verwandte Entities erstellen
- **`afterResolve`**: Cross-Entity-Synchronisation, Nachberechnungen
- **`beforeAddRelation`**: Defaults auf verschachtelten Entities setzen
:::

---

## Options-Request

Der `optionsRequest()` konfiguriert, wie der Client die verfügbaren Optionen für ein Feld (typischerweise eine Relation) lädt.

### Grundstruktur

```php
->linkOne('category', CategoryType::class)->on(UPDATE, CREATE)
    ->optionsRequest(function (ApiRequest $request) {
        $request
            ->resourceType(CategoryResource::type())
            ->actionName('list')
            ->params([...])
            ->filters([...])
            ->fields([...]);
    })
```

### Parameter

| Methode | Beschreibung |
|---------|-------------|
| `resourceType()` | Welche Resource angefragt wird |
| `actionName()` | Welche Action (typischerweise `'list'`) |
| `params()` | Feste Parameter für die Anfrage |
| `filters()` | Filter (z.B. Sortierung) |
| `fields()` | Welche Felder geladen werden sollen |

### Beispiel: Kategorie-Auswahl

```php
->linkOne('gender', CategoryType::class)->on(UPDATE, CREATE)
    ->optionsRequest(function (ApiRequest $request) {
        $request
            ->resourceType(CategoryResource::type())
            ->actionName('list')
            ->params(['category_type_key' => 'gender'])
            ->fields(['title' => true]);
    })
```

### Beispiel: Sortierte Liste mit Relationen

```php
->linkOne('customer', CustomerType::class)->on(UPDATE, CREATE)
    ->optionsRequest(function (ApiRequest $request) {
        $request
            ->resourceType(CustomerResource::type())
            ->actionName('list')
            ->filters(['order' => ['created_at' => 'desc']])
            ->fields([
                'name' => true,
                'company' => [
                    'is_active' => true,
                    'address' => [
                        'city' => true
                    ]
                ]
            ]);
    })
```

### Beispiel: Polymorphe Options

Bei polymorphen Relationen können Fields pro Type spezifiziert werden (mit `@TypeName` Prefix):

```php
->linkOne('owner', [CompanyType::class, ContactType::class])
    ->on(UPDATE, CREATE)
    ->optionsRequest(function (ApiRequest $request) {
        $request
            ->resourceType(AddressResource::type())
            ->actionName('company_addresses')
            ->fields([
                '@App.Company' => [
                    'display_name' => true,
                    'address' => ['city' => true]
                ],
                '@App.Contact' => [
                    'name' => true,
                    'address' => ['city' => true]
                ]
            ]);
    })
```

## Enum Options

Für einfache Auswahllisten ohne Relation:

```php
->enum('status')->on(READ, UPDATE, CREATE)
    ->options(['draft', 'published', 'archived'])
```

## additionalSaveFields

Wenn beim Speichern einer Relation zusätzliche Felder gesetzt werden sollen:

```php
->hasOne('address', AddressType::class)->on(READ, UPDATE, CREATE)
    ->setAdditionalSaveFields(function () {
        return ['address_type' => 'billing'];
    })
```

## skipSaveRelatedIf

Überspringt das Speichern der Relation unter bestimmten Bedingungen:

```php
->hasOne('contact', ContactType::class)->on(READ, UPDATE, CREATE)
    ->skipSaveRelatedIf(function ($data) {
        return empty($data['name']) && empty($data['email']);
    })
```
