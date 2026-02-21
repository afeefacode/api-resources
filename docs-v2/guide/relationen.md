# Relationen

## Grundlagen

Relationen verknüpfen Types miteinander. In v2 gibt es zwei Methoden:

| Methode | Kardinalität |
|---------|-------------|
| `hasOne()` | Einzeln |
| `hasMany()` | Liste |

Der **Modus** bestimmt, wie eine Relation beim Schreiben behandelt wird. Er wird über `->onMutation(mode: ...)` gesetzt:

```php
$fields
    // Adresse: inline bearbeiten (save)
    ->hasOne('address', AddressType::class)->on(READ, UPDATE, CREATE)

    // Kategorie: nur verknüpfen (link)
    ->hasOne('gender', CategoryType::class)->on(READ, UPDATE, CREATE)
        ->onMutation(mode: 'link')

    // Tags: viele verknüpfen (link)
    ->hasMany('tags', TagType::class)->on(READ, UPDATE, CREATE)
        ->onMutation(mode: 'link')
```

## Relation-Modi

Modi bestimmen, **wie** eine Relation beim Schreiben behandelt wird:

### `save` — Inline Edit/Create (Default)

Der Client sendet das volle Objekt. Der Server erstellt oder aktualisiert die verknüpfte Entität. Dies ist der Standard-Modus wenn kein `mode` angegeben ist.

```php
->hasOne('address', AddressType::class)->on(READ, UPDATE, CREATE)
```

### `link` — FK setzen

Der Client sendet nur eine ID. Der Server setzt den Fremdschlüssel.

```php
->hasOne('customer', CustomerType::class)->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
```

### `link_or_save` — Beides möglich

Der Client kann entweder eine ID senden (link) oder ein volles Objekt (save). Der Resolver entscheidet basierend auf dem gesendeten Payload.

```php
->hasOne('customer', CustomerType::class)->on(READ, UPDATE, CREATE)
    ->onCreate(mode: 'link_or_save')
```

::: tip Wann `link_or_save`?
Typischer Anwendungsfall: Beim Erstellen einer Bestellung kann der Kunde entweder aus der bestehenden Liste ausgewählt werden (link) oder direkt neu angelegt werden (save).

In v1 wurde dafür ein separates Feld `customer_new` als Workaround benutzt. V2 löst das sauber über den Modus.
:::

### Modi pro Operation überschreiben

Der Modus kann pro Operation unterschiedlich sein:

```php
->hasOne('customer', CustomerType::class)->on(READ, UPDATE, CREATE)
    ->onUpdate(mode: 'link')          // Update: nur verknüpfen
    ->onCreate(mode: 'link_or_save')  // Create: verknüpfen oder neu anlegen
```

### Wie funktioniert das intern?

`mode: 'link'` erzeugt intern exakt den gleichen v1-Zustand wie das alte `linkOne()`. Der `ModelRelationResolver` erkennt das `link`-Flag auf dem materialisierten v1-Field und weist automatisch den richtigen Resolver zu:

| Mode | isList | Resolver |
|------|--------|----------|
| `link` | false | `save_link_one_relation` |
| `link` | true | `save_link_many_relation` |
| `save` | false | `save_has_one_relation` |
| `save` | true | `save_has_many_relation` |

## Polymorphe Relationen

Wenn eine Relation auf **mehrere Types** zeigen kann, wird ein Array übergeben:

```php
->hasOne('owner', [CompanyType::class, ContactType::class])->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
```

## Validierung bei Relationen

```php
->hasOne('customer', CustomerType::class)->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
    ->onMutation(validate: fn(LinkOneValidator $v) => $v->filled())
    ->onCreate(required: true)
```

| Validator | Für |
|-----------|-----|
| `LinkOneValidator` | hasOne mit mode `link` |
| `LinkManyValidator` | hasMany mit mode `link` |

## restrictTo

Schränkt die Relation auf einen bestimmten Kontext ein:

```php
->hasOne('customer', CustomerType::class)->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
    ->restrictTo('active_customers')
```

Der `restrictTo`-Wert wird ans Schema und an den Client weitergegeben, um z.B. Suchergebnisse einzuschränken.

## optionsRequest

Definiert eine API-Anfrage, die der Client nutzt, um die verfügbaren Optionen für eine Relation zu laden:

```php
->hasOne('gender', CategoryType::class)->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
    ->optionsRequest(function (ApiRequest $request) {
        $request
            ->resourceType(CategoryResource::type())
            ->actionName('list')
            ->params(['category_type_key' => 'gender'])
            ->fields(['title' => true]);
    })
```

Mehr dazu unter [Resolver & Options](./resolver.md).

## Praxis-Beispiele

### Read-Only Relation

```php
// Creator/Editor nur anzeigen, nie schreiben
->hasOne('creator', AccountType::class)->on(READ)
->hasOne('last_editor', AccountType::class)->on(READ)
```

### Kategorie-Auswahl (Link mit Options)

```php
->hasOne('country', CategoryType::class)->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
    ->optionsRequest(function (ApiRequest $request) {
        $request
            ->resourceType(CategoryResource::type())
            ->actionName('list')
            ->params(['category_type_key' => 'country'])
            ->fields(['title' => true]);
    })
```

### Many-to-Many (hasMany + link)

```php
->hasMany('tags', TagType::class)->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
    ->optionsRequest(function (ApiRequest $request) {
        $request
            ->resourceType(TagResource::type())
            ->actionName('list')
            ->fields(['title' => true]);
    })
```

### Inline-Edit (hasOne ohne mode)

```php
// Adresse wird inline bearbeitet/erstellt (nicht nur verknüpft)
->hasOne('address', AddressType::class)->on(READ, UPDATE, CREATE)
```

Hier sendet der Client das volle Adress-Objekt. Der Resolver erstellt oder aktualisiert die Adresse automatisch.

### Verschachtelte Validierung

```php
->hasOne('cancellation', NoteType::class)->on(UPDATE)
    ->onUpdate(validate: fn(LinkOneValidator $v) => $v->filled())
```

### Computed + Custom Resolver

```php
->hasOne('primary_contact', PersonType::class)->on(READ)
    ->resolve([CustomerResolver::class, 'resolve_primary_contact'])
```
