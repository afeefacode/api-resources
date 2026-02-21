# Klassen-Übersicht

Alle V2-Klassen leben in `api-resources-server/src/V2/`.

## Operation

```php
namespace Afeefa\ApiResources\V2;

enum Operation: string {
    case READ = 'read';
    case UPDATE = 'update';
    case CREATE = 'create';
}
```

Zusätzlich exportierte Konstanten für kurze Syntax:

```php
use const Afeefa\ApiResources\V2\{READ, UPDATE, CREATE};
```

## Field

Blueprint-Basisklasse. Speichert Konfiguration und erzeugt v1 Fields via `toV1Field()`.

### Methoden

| Methode | Beschreibung |
|---------|-------------|
| `on(Operation ...$ops)` | Operationen zuweisen |
| `onMutation($validate, $required)` | Config für UPDATE + CREATE |
| `onUpdate($validate, $required)` | Config nur für UPDATE |
| `onCreate($validate, $required)` | Config nur für CREATE |
| `validate($callback)` | Globaler Validator (alle Mutationen) |
| `required(bool)` | Pflichtfeld (global) |
| `default($value)` | Default-Wert |
| `resolve($classOrCallback, $params)` | Custom Resolver |
| `options(array)` | Feste Options (Enum) |
| `optionsRequest(Closure)` | Dynamische Options via API-Request |

### Priorisierung

Per-Operation Konfiguration überschreibt globale:

```
validate: perOpValidate[$op] ?? $this->validate
required: perOpRequired[$op] ?? $this->required
```

## Attribute

Extends `Field`. Keine zusätzliche Logik — existiert für semantische Klarheit.

## Relation

Extends `Field`. Zusätzliche Funktionalität für Relationen.

### Zusätzliche Properties

| Property | Typ | Beschreibung |
|----------|-----|-------------|
| `TypeClassOrClasses` | string\|array | Ziel-Type(s) der Relation |
| `isList` | bool | true bei hasMany/linkMany |
| `restrictTo` | string\|null | Einschränkung für Options-Suche |
| `perOpMode` | array | Modus pro Operation |

### Zusätzliche Methoden

| Methode | Beschreibung |
|---------|-------------|
| `onMutation($mode, $validate, $required)` | + `mode` Parameter |
| `onUpdate($mode, $validate, $required)` | + `mode` Parameter |
| `onCreate($mode, $validate, $required)` | + `mode` Parameter |
| `restrictTo($restrictTo)` | Sucheinschränkung |
| `setAdditionalSaveFields(Closure)` | Zusätzliche Felder beim Speichern |
| `skipSaveRelatedIf(Closure)` | Speichern überspringen |

### Modi

| Modus | Bedeutung | v1 Äquivalent |
|-------|-----------|---------------|
| `'link'` | FK setzen | `linkOne()` / `linkMany()` |
| `'save'` | Inline Edit/Create | `hasOne()` / `hasMany()` |
| `'link_or_save'` | Beides möglich | `customer` + `customer_new` Workaround |

### Modus-Bestimmung in toV1Field()

```
mode = perOpMode[$op] ?? null
isLink = (mode === 'link' || mode === 'link_or_save')

isList && isLink  → Type::list(Type::link($TypeClass))
isList && !isLink → Type::list($TypeClass)
!isList && isLink → Type::link($TypeClass)
!isList && !isLink → $TypeClass (plain)
```

## FieldBag

Extends `V1\FieldBag`. Sammelt Blueprints, delegiert Chaining-Methoden an `$lastField`.

### Builder-Methoden (geerbt von v1)

| Methode | Erzeugt |
|---------|---------|
| `string($name)` | Attribute (StringAttribute) |
| `int($name)` | Attribute (IntAttribute) |
| `number($name)` | Attribute (NumberAttribute) |
| `boolean($name)` | Attribute (BooleanAttribute) |
| `date($name)` | Attribute (DateAttribute) |
| `enum($name)` | Attribute (EnumAttribute) |
| `json($name)` | Attribute (JsonAttribute) |
| `id($name)` | Attribute (IdAttribute) |
| `hasOne($name, $Type)` | Relation (save, single) |
| `hasMany($name, $Type)` | Relation (save, list) |
| `linkOne($name, $Type)` | Relation (link, single) |
| `linkMany($name, $Type)` | Relation (link, list) |

### Delegation-Methoden

Alle diese werden an `$lastField` delegiert:

`on()`, `onMutation()`, `onUpdate()`, `onCreate()`, `validate()`, `required()`, `default()`, `resolve()`, `restrictTo()`

### Konvertierung

| Methode | Beschreibung |
|---------|-------------|
| `forOperation(Operation)` | Erzeugt WritableFieldBag mit v1 Fields |

## WritableFieldBag

Extends `V1\FieldBag`. Exposiert `addField(string $name, V1\Field $field)`.

Wird intern von `FieldBag::forOperation()` genutzt.

## Type

Extends `V1\Type`. Overrides `created()`.

```php
public function created(): void {
    $v2Fields = $this->container->create(FieldBag::class)->owner($this);
    $this->defineFields($v2Fields);
    $this->fields = $v2Fields->forOperation(Operation::READ);
    $this->updateFields = $v2Fields->forOperation(Operation::UPDATE);
    $this->createFields = $v2Fields->forOperation(Operation::CREATE);
}
```

### Zu überschreiben

```php
protected function defineFields(FieldBag $fields): void
{
    // Felder hier definieren
}
```

## ModelType

Extends `V2\Type`. Für Eloquent-basierte Types.

### Properties

| Property | Typ | Beschreibung |
|----------|-----|-------------|
| `$ModelClass` | static string | Eloquent Model-Klasse |

### Automatische Resolver

`ModelType` registriert nach `parent::created()` automatisch:

- **READ-Relationen:** `ModelRelationResolver::get_relation`
- **Mutation-Relationen (single + save):** `save_has_one_relation`
- **Mutation-Relationen (single + link):** `save_belongs_to_relation`
- **Mutation-Relationen (list + save):** `save_has_many_relation`
- **Mutation-Relationen (list + link):** `save_belongs_to_many_relation`
