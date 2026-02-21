# Migration v1 → v2

## Überblick

V1 Types können **schrittweise** zu v2 migriert werden. V1 und v2 Types koexistieren im selben Projekt — das Schema-JSON bleibt identisch.

## Schritt für Schritt

### 1. Basisklasse und Imports ändern

```php
// Vorher (v1)
use Afeefa\ApiResources\Eloquent\ModelType;
use Afeefa\ApiResources\Field\FieldBag;

// Nachher (v2)
use Afeefa\ApiResources\V2\ModelType;
use Afeefa\ApiResources\V2\FieldBag;
use const Afeefa\ApiResources\V2\{READ, UPDATE, CREATE};
```

Nicht mehr benötigte Imports entfernen (z.B. `Afeefa\ApiResources\Field\FieldBag`).

### 2. Drei Methoden → Eine

In v1 gibt es drei Methoden:

```php
// v1
protected function fields(FieldBag $fields): void { ... }
protected function updateFields(FieldBag $updateFields): void { ... }
protected function createFields(FieldBag $createFields, FieldBag $updateFields): void { ... }
```

In v2 gibt es nur noch eine — mit eigenem Methodennamen `defineFields()`:

```php
// v2
protected function defineFields(FieldBag $fields): void { ... }
```

### 3. Felder zusammenführen und Operationen zuweisen

**Regel:** Jedes Feld aus den drei v1-Methoden wird genau einmal definiert. Die `->on()` Operationen ergeben sich daraus, in welchen v1-Methoden das Feld vorkam:

| Feld kommt vor in | → `->on(...)` |
|---|---|
| nur `fields()` | `->on(READ)` |
| `fields()` + `updateFields()` + `createFields()` | `->on(READ, UPDATE, CREATE)` |
| nur `updateFields()` + `createFields()` | `->on(UPDATE, CREATE)` |
| nur `updateFields()` | `->on(UPDATE)` |

#### Beispiel

```php
// v1
protected function fields(FieldBag $fields): void {
    $fields->string('name');
}
protected function updateFields(FieldBag $updateFields): void {
    $updateFields->string('name', validate: fn(StringValidator $v) => $v->filled());
}
protected function createFields(FieldBag $createFields, FieldBag $updateFields): void {
    $createFields->from($updateFields, 'name');
}
```

```php
// v2
$fields
    ->string('name')->on(READ, UPDATE, CREATE)
        ->onMutation(validate: fn(StringValidator $v) => $v->filled());
```

### 4. `->from()` Referenzen auflösen

V1 nutzt `->from($updateFields, 'name')` um Felder zwischen FieldBags zu kopieren. In v2 gibt es kein `from()` mehr — jedes Feld wird einmal definiert.

| v1 Pattern | v2 Äquivalent |
|-----------|---------------|
| `createFields->from($updateFields, 'x')` | Feld bekommt zusätzlich `CREATE` in `->on()` |
| `from($updateFields, 'x', fn($a) => $a->required())` | `->onCreate(required: true)` |

#### Beispiel mit Callback

```php
// v1
$createFields->from($updateFields, 'date', function (Attribute $attribute) {
    $attribute->required();
});

// v2
->date('date')->on(READ, UPDATE, CREATE)
    ->onCreate(required: true)
```

### 5. hasOne/linkOne Paare zusammenführen

In v1 werden für Relationen oft **zwei getrennte Felder** verwendet: `hasOne` in `fields()` zum Lesen und `linkOne` in `updateFields()` zum Verknüpfen.

In v2 wird daraus **ein einzelnes Feld** mit `mode: 'link'`:

```php
// v1
// In fields():
$fields->hasOne('gender', CategoryType::class);
// In updateFields():
$updateFields->linkOne('gender', CategoryType::class);
// In createFields():
$createFields->from($updateFields, 'gender');

// v2
->hasOne('gender', CategoryType::class)->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
```

::: tip Warum funktioniert das?
`mode: 'link'` erzeugt intern exakt den gleichen v1-Zustand wie ein `linkOne()`. Der `ModelRelationResolver` erkennt das `link`-Flag und weist automatisch den richtigen Resolver zu (`save_link_one_relation`).
:::

#### Mit optionsRequest

```php
// v1
$updateFields->linkOne('country', CategoryType::class, function (Relation $relation) {
    $relation->optionsRequest(function (ApiRequest $request) {
        $request->resourceType(CategoryResource::type())
            ->actionName('list')
            ->params(['category_type_key' => 'country'])
            ->fields(['title' => true]);
    });
});

// v2
->hasOne('country', CategoryType::class)->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
    ->optionsRequest(function (ApiRequest $request) {
        $request->resourceType(CategoryResource::type())
            ->actionName('list')
            ->params(['category_type_key' => 'country'])
            ->fields(['title' => true]);
    })
```

#### hasMany/linkMany analog

```php
// v1
$fields->hasMany('tags', TagType::class);
$updateFields->linkMany('tags', TagType::class);

// v2
->hasMany('tags', TagType::class)->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
```

#### `_new`-Workarounds entfernen

Wenn in v1 ein `_new`-Feld existiert (z.B. `customer_new` als hasOne in `createFields`), wird es in v2 über den Modus `link_or_save` gelöst:

```php
// v1
// In fields():     hasOne('customer', CustomerType::class)
// In updateFields: linkOne('customer', CustomerType::class)
// In createFields: linkOne('customer', ...)  + hasOne('customer_new', CustomerType::class)

// v2 – customer_new entfällt komplett
->hasOne('customer', CustomerType::class)->on(READ, UPDATE, CREATE)
    ->onUpdate(mode: 'link')
    ->onCreate(mode: 'link_or_save')
```

### 6. Validierung migrieren

V1 nutzt Closure-Callbacks, v2 bietet `->onMutation()`, `->onUpdate()`, `->onCreate()`:

```php
// v1
$updateFields->string('name', validate: fn(StringValidator $v) => $v->filled());

// v2
->string('name')->on(READ, UPDATE, CREATE)
    ->onMutation(validate: fn(StringValidator $v) => $v->filled())
```

Wenn UPDATE und CREATE **gleiche** Validierung haben → `->onMutation(validate: ...)`.
Wenn **unterschiedlich** → separate `->onUpdate(validate: ...)` und `->onCreate(validate: ...)`.

#### required-Pattern

Wenn UPDATE `validate: fn($v) => $v->filled()` hat UND CREATE `required: true`:

```php
->string('name')->on(READ, UPDATE, CREATE)
    ->onUpdate(validate: fn(StringValidator $v) => $v->filled())
    ->onCreate(required: true)
```

### 7. Relation-Callbacks in Chaining umwandeln

V1 nutzt Closure-Callbacks für Relation-Konfiguration. In v2 wird direkt gekettet:

```php
// v1
$updateFields->linkOne('customer', CustomerType::class, function (Relation $relation) {
    $relation
        ->validate(fn(LinkOneValidator $v) => $v->filled())
        ->optionsRequest(function (ApiRequest $request) { ... });
});

// v2
->hasOne('customer', CustomerType::class)->on(READ, UPDATE, CREATE)
    ->onMutation(mode: 'link')
    ->onMutation(validate: fn(LinkOneValidator $v) => $v->filled())
    ->optionsRequest(function (ApiRequest $request) { ... })
```

### 8. Resolver und restrictTo beibehalten

```php
// v1: function (Relation $r) { $r->restrictTo('xyz'); }
// v2:
->restrictTo('xyz')

// v1: function (Attribute $a) { $a->resolve(...); }
// v2:
->resolve([MyResolver::class, 'resolve_something'])
```

## Migrations-Checkliste

- [ ] Basisklasse auf `V2\ModelType` (oder `V2\Type`) ändern
- [ ] `use Afeefa\ApiResources\V2\FieldBag` importieren
- [ ] `use const Afeefa\ApiResources\V2\{READ, UPDATE, CREATE}` importieren
- [ ] Nicht mehr benötigte Imports entfernen (`Field\FieldBag` etc.)
- [ ] Drei Methoden (`fields`/`updateFields`/`createFields`) in eine `defineFields()` zusammenführen
- [ ] Jedes Feld mit `->on(...)` versehen
- [ ] `->from()` Referenzen auflösen
- [ ] hasOne/linkOne Paare zu `hasOne` + `mode: 'link'` zusammenführen
- [ ] `_new`-Workarounds durch `mode: 'link_or_save'` ersetzen
- [ ] Validierung in `->onUpdate()`/`->onCreate()`/`->onMutation()` überführen
- [ ] Relation-Callbacks in Chaining umwandeln
- [ ] Schema-JSON vergleichen (sollte identisch sein)
- [ ] Tests ausführen

## Migrations-Skill

Das Projekt enthält einen Skill für automatische Migrationen:

```
/migrate-type <DateiPfad>
```

Der Skill analysiert die v1-Datei, wendet alle Migrationsregeln an und schreibt die v2-Datei. Anschließend wird die PHP-Syntax geprüft und eine Zusammenfassung ausgegeben.

## Vollständiges Migrations-Beispiel

### v1

```php
<?php

namespace App\Types;

use Afeefa\ApiResources\Eloquent\ModelType;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Validator\Validators\StringValidator;

class PersonType extends ModelType
{
    protected static string $type = 'App.Person';
    public static string $ModelClass = Person::class;

    protected function fields(FieldBag $fields): void
    {
        $fields
            ->string('first_name')
            ->string('last_name')
            ->date('date_birth')
            ->date('created_at')
            ->hasOne('gender', CategoryType::class)
            ->hasOne('country', CategoryType::class);
    }

    protected function updateFields(FieldBag $updateFields): void
    {
        $updateFields
            ->string('first_name', validate: fn(StringValidator $v) => $v->min(2)->max(100))
            ->string('last_name', validate: fn(StringValidator $v) => $v->filled()->min(2)->max(100))
            ->date('date_birth')
            ->linkOne('gender', CategoryType::class, function (Relation $relation) {
                $relation->optionsRequest(function (ApiRequest $request) {
                    $request
                        ->resourceType(CategoryResource::type())
                        ->actionName('list')
                        ->params(['category_type_key' => 'gender'])
                        ->fields(['title' => true]);
                });
            })
            ->linkOne('country', CategoryType::class, function (Relation $relation) {
                $relation->optionsRequest(function (ApiRequest $request) {
                    $request
                        ->resourceType(CategoryResource::type())
                        ->actionName('list')
                        ->params(['category_type_key' => 'country'])
                        ->fields(['title' => true]);
                });
            });
    }

    protected function createFields(FieldBag $createFields, FieldBag $updateFields): void
    {
        $createFields
            ->from($updateFields, 'first_name')
            ->from($updateFields, 'last_name')
            ->from($updateFields, 'date_birth');
    }
}
```

### v2

```php
<?php

namespace App\Types;

use Afeefa\ApiResources\V2\FieldBag;
use Afeefa\ApiResources\V2\ModelType;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Validator\Validators\StringValidator;
use const Afeefa\ApiResources\V2\{READ, UPDATE, CREATE};

class PersonType extends ModelType
{
    protected static string $type = 'App.Person';
    public static string $ModelClass = Person::class;

    protected function defineFields(FieldBag $fields): void
    {
        $fields
            ->string('first_name')->on(READ, UPDATE, CREATE)
                ->onMutation(validate: fn(StringValidator $v) => $v->min(2)->max(100))

            ->string('last_name')->on(READ, UPDATE, CREATE)
                ->onMutation(validate: fn(StringValidator $v) => $v->filled()->min(2)->max(100))

            ->date('date_birth')->on(READ, UPDATE, CREATE)

            ->date('created_at')->on(READ)

            ->hasOne('gender', CategoryType::class)->on(READ, UPDATE, CREATE)
                ->onMutation(mode: 'link')
                ->optionsRequest(function (ApiRequest $request) {
                    $request
                        ->resourceType(CategoryResource::type())
                        ->actionName('list')
                        ->params(['category_type_key' => 'gender'])
                        ->fields(['title' => true]);
                })

            ->hasOne('country', CategoryType::class)->on(READ, UPDATE, CREATE)
                ->onMutation(mode: 'link')
                ->optionsRequest(function (ApiRequest $request) {
                    $request
                        ->resourceType(CategoryResource::type())
                        ->actionName('list')
                        ->params(['category_type_key' => 'country'])
                        ->fields(['title' => true]);
                });
    }
}
```

**Ergebnis:** `defineFields()` statt 3 Methoden. Kein `->from()`. Jedes Feld genau einmal definiert. `linkOne` ersetzt durch `hasOne` + `mode: 'link'`. Identisches Schema-JSON.
