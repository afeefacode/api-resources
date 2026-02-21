# Getting Started

## Basisklasse wählen

V2 Types erben von `Afeefa\ApiResources\V2\ModelType` (mit Eloquent-Model) oder `Afeefa\ApiResources\V2\Type` (ohne Model).

```php
use Afeefa\ApiResources\V2\ModelType;

class PersonType extends ModelType
{
    protected static string $type = 'App.Person';
    public static string $ModelClass = Person::class;
}
```

::: tip
Die Klasse `V2\ModelType` kümmert sich automatisch um Eloquent-Relation-Resolver. Du musst keine Resolver manuell registrieren, solange die Eloquent-Relationen auf dem Model existieren.
:::

## Die `defineFields()` Methode

Statt drei separater Methoden (`fields()`, `updateFields()`, `createFields()`) gibt es nur noch **eine einzige**. Jedes Feld bekommt mit `->on()` seine Operationen zugewiesen:

```php
use Afeefa\ApiResources\V2\FieldBag;
use const Afeefa\ApiResources\V2\{READ, UPDATE, CREATE};

protected function defineFields(FieldBag $fields): void
{
    $fields
        ->string('first_name')->on(READ, UPDATE, CREATE)
        ->string('last_name')->on(READ, UPDATE, CREATE)
        ->date('date_birth')->on(READ, UPDATE, CREATE)
        ->date('created_at')->on(READ);
}
```

### Operation-Konstanten

| Konstante | Bedeutung |
|-----------|-----------|
| `READ` | Feld wird in GET-Responses ausgeliefert |
| `UPDATE` | Feld kann beim Aktualisieren gesendet werden |
| `CREATE` | Feld kann beim Erstellen gesendet werden |

Die Konstanten sind in `Afeefa\ApiResources\V2` definiert und können per `use function` importiert werden:

```php
use const Afeefa\ApiResources\V2\{READ, UPDATE, CREATE};
```

## Vollständiges Beispiel

Ein typischer Type mit Attributen, Validierung und einer Relation:

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
            // Nur lesen
            ->date('created_at')->on(READ)

            // Lesen + Schreiben, mit Validierung
            ->string('first_name')->on(READ, UPDATE, CREATE)
                ->onUpdate(validate: fn(StringValidator $v) => $v->min(2)->max(100))

            ->string('last_name')->on(READ, UPDATE, CREATE)
                ->onUpdate(validate: fn(StringValidator $v) => $v->filled()->min(2)->max(100))
                ->onCreate(required: true)

            // Relation: lesen und verknüpfen (mode: 'link')
            ->hasOne('gender', CategoryType::class)->on(READ, UPDATE, CREATE)
                ->onMutation(mode: 'link')
                ->optionsRequest(function (ApiRequest $request) {
                    $request
                        ->resourceType(CategoryResource::type())
                        ->actionName('list')
                        ->params(['category_type_key' => 'gender'])
                        ->fields(['title' => true]);
                });
    }
}
```

### Was passiert intern?

V2 erzeugt **identisches Schema-JSON** wie v1. Die `defineFields()` Methode erstellt intern Blueprints, die in drei v1 FieldBags aufgesplittet werden:

```
defineFields() mit ->on(READ, UPDATE, CREATE)
       │
       ├─→ $this->fields        (READ FieldBag)
       ├─→ $this->updateFields  (UPDATE FieldBag)
       └─→ $this->createFields  (CREATE FieldBag)
```

Resources, Actions, Resolver und Client sehen keinen Unterschied.

## Häufige Muster

### Read-Only Felder

Felder die nur gelesen werden (z.B. Timestamps, berechnete Werte):

```php
->date('created_at')->on(READ)
->date('updated_at')->on(READ)
->number('item_count')->on(READ)
```

### Mutation-Only Felder

Felder die nur beim Schreiben relevant sind:

```php
->string('password')->on(UPDATE, CREATE)
```

### Feld mit Pflichtfeld bei Erstellung

```php
->string('name')->on(READ, UPDATE, CREATE)
    ->onUpdate(validate: fn(StringValidator $v) => $v->filled())
    ->onCreate(required: true)
```

`required: true` bedeutet: Das Feld **muss** beim Erstellen gesendet werden.
`validate: fn($v) => $v->filled()` bedeutet: Wenn gesendet, darf es nicht leer sein.

### Default-Werte

```php
->string('status')->on(READ, UPDATE, CREATE)
    ->default('draft')
```
