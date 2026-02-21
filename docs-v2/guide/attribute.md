# Attribute

## Verfügbare Feld-Typen

Alle Builder-Methoden von v1 stehen in v2 zur Verfügung:

| Methode | Attribute-Klasse | Beschreibung |
|---------|-----------------|-------------|
| `->string()` | StringAttribute | Text-Felder |
| `->text()` | StringAttribute | Alias für string (semantisch für längere Texte) |
| `->int()` | IntAttribute | Ganzzahlen |
| `->number()` | NumberAttribute | Dezimalzahlen |
| `->boolean()` | BooleanAttribute | true/false |
| `->date()` | DateAttribute | Datum/Zeit |
| `->enum()` | EnumAttribute | Aufzählung mit fixen Werten |
| `->json()` | JsonAttribute | JSON-Daten |
| `->id()` | IdAttribute | ID-Felder |

## Basis-Syntax

```php
$fields
    ->string('name')->on(READ, UPDATE, CREATE)
    ->int('age')->on(READ, UPDATE, CREATE)
    ->boolean('is_active')->on(READ, UPDATE)
    ->date('created_at')->on(READ);
```

## Validierung

Validierung wird über den `validate`-Parameter konfiguriert. Der Callback bekommt den passenden Validator-Typ injiziert:

```php
$fields
    ->string('name')->on(READ, UPDATE, CREATE)
        ->validate(fn(StringValidator $v) => $v->filled()->min(2)->max(100));
```

::: warning Wichtig
Der Type-Hint im Callback (z.B. `StringValidator $v`) ist **zwingend erforderlich**. Der DI-Container nutzt ihn, um die richtige Validator-Instanz zu erzeugen.
:::

### Globale vs. Per-Operation Validierung

**Globale Validierung** gilt für alle Mutationen (UPDATE + CREATE):

```php
->string('name')->on(READ, UPDATE, CREATE)
    ->validate(fn(StringValidator $v) => $v->min(2)->max(100))
```

**Per-Operation Validierung** überschreibt die globale für eine bestimmte Operation:

```php
->string('email')->on(READ, UPDATE, CREATE)
    ->validate(fn(StringValidator $v) => $v->max(200))           // global
    ->onUpdate(validate: fn(StringValidator $v) => $v->filled())  // nur UPDATE
    ->onCreate(required: true)                                    // nur CREATE
```

Hier gilt für UPDATE: `filled()` (überschreibt `max(200)`). Für CREATE: `max(200)` (global) + Pflichtfeld.

### Verfügbare Validatoren

| Validator | Für | Wichtige Methoden |
|-----------|-----|-------------------|
| `StringValidator` | string, text | `filled()`, `min(n)`, `max(n)` |
| `IntValidator` | int | `filled()`, `min(n)`, `max(n)` |
| `NumberValidator` | number | `filled()`, `min(n)`, `max(n)` |
| `DateValidator` | date | `filled()` |
| `SetValidator` | set | `filled()` |
| `LinkOneValidator` | linkOne | `filled()` |
| `LinkManyValidator` | linkMany | `filled()` |
| `TextValidator` | text (erweitert StringValidator) | `filled()`, `min(n)`, `max(n)` |

## Pflichtfelder

`required: true` bedeutet, dass das Feld beim Senden **vorhanden sein muss**. Das ist nicht dasselbe wie Validierung:

```php
// Muss gesendet werden UND darf nicht leer sein
->string('name')->on(READ, UPDATE, CREATE)
    ->onCreate(required: true, validate: fn(StringValidator $v) => $v->filled())

// Muss gesendet werden, darf aber leer sein
->string('name')->on(READ, UPDATE, CREATE)
    ->onCreate(required: true)
```

### Typisches Muster: Pflicht bei Erstellung, optional bei Update

```php
->string('name')->on(READ, UPDATE, CREATE)
    ->onUpdate(validate: fn(StringValidator $v) => $v->filled())
    ->onCreate(required: true)
```

### Shorthand: `onMutation()`

`onMutation()` setzt die Konfiguration für UPDATE **und** CREATE gleichzeitig:

```php
// Äquivalent zu ->onUpdate(validate: ...) + ->onCreate(validate: ...)
->string('name')->on(READ, UPDATE, CREATE)
    ->onMutation(validate: fn(StringValidator $v) => $v->filled())
```

## Default-Werte

```php
->string('status')->on(READ, UPDATE, CREATE)
    ->default('draft')
```

## Enum-Felder mit Options

Enum-Felder können feste Optionen definieren:

```php
->enum('status')->on(READ, UPDATE, CREATE)
    ->options(['draft', 'published', 'archived'])
```

## Options-Request

Für dynamische Optionen (z.B. aus der Datenbank) wird `optionsRequest()` verwendet:

```php
->linkOne('category', CategoryType::class)->on(UPDATE, CREATE)
    ->optionsRequest(function (ApiRequest $request) {
        $request
            ->resourceType(CategoryResource::type())
            ->actionName('list')
            ->params(['category_type_key' => 'gender'])
            ->fields(['title' => true]);
    })
```

Mehr dazu unter [Resolver & Options](./resolver.md).

## Custom Resolver

Berechnete Felder können einen eigenen Resolver bekommen:

```php
->number('total')->on(READ)
    ->resolve([CostResolver::class, 'resolve_total'])
```

Mehr dazu unter [Resolver & Options](./resolver.md).
