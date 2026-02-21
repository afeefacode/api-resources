# Konzept & Architektur

## Warum v2?

In v1 werden Felder in drei separaten Methoden definiert:

```php
// v1: Dreifache Definition
class PersonType extends ModelType
{
    protected function fields(FieldBag $fields): void
    {
        $fields->string('first_name')->string('last_name');
    }

    protected function updateFields(FieldBag $updateFields): void
    {
        $updateFields
            ->string('first_name', validate: fn(StringValidator $v) => $v->min(2))
            ->string('last_name', validate: fn(StringValidator $v) => $v->filled());
    }

    protected function createFields(FieldBag $createFields, FieldBag $updateFields): void
    {
        $createFields
            ->from($updateFields, 'first_name')
            ->from($updateFields, 'last_name');
    }
}
```

**Probleme:**
- Felder werden bis zu 3x wiederholt
- `->from()` Referenzen sind fragil und schwer nachzuvollziehen
- Bei 40+ Feldern (z.B. großen Types) wird der Code unübersichtlich
- Leicht vergessen, ein Feld in einer der drei Methoden zu ergänzen

**V2 löst das** durch eine einzige `defineFields()` Methode mit expliziten Operationen pro Feld.

## Architektur-Übersicht

```
V2\Type extends V1\Type
  └─ created() überschrieben
     │
     ├─ Erstellt V2\FieldBag (extends V1\FieldBag)
     ├─ Ruft $this->defineFields($v2Bag) auf  ← hier schreibt der Entwickler
     │
     └─ Splittet in 3 v1 FieldBags:
        ├─ $this->fields        = $v2Bag->forOperation(READ)
        ├─ $this->updateFields  = $v2Bag->forOperation(UPDATE)
        └─ $this->createFields  = $v2Bag->forOperation(CREATE)
```

### Blueprint-Muster

V2 Fields sind **keine** v1 Fields. Sie sind Blueprints — Rezepte, die für jede Operation ein passendes v1 Field erzeugen:

```
$fields->string('name')->on(READ, UPDATE)->onUpdate(validate: ...)
                │                                        │
                └─ Erstellt V2\Attribute Blueprint        └─ Setzt perOpValidate['update']
                   mit v1FieldClass = StringAttribute

forOperation(READ)   → toV1Field(READ)   → StringAttribute ohne Validator
forOperation(UPDATE) → toV1Field(UPDATE) → StringAttribute mit Validator
```

### Klassen-Hierarchie

| V2 Klasse | Extends | Rolle |
|-----------|---------|-------|
| `Operation` | enum | READ, UPDATE, CREATE |
| `Field` | – | Blueprint-Basis: Konfiguration + `toV1Field()` |
| `Attribute` | Field | Semantischer Alias (kein extra Code) |
| `Relation` | Field | + Modus (link/save), TypeMeta, restrictTo |
| `FieldBag` | V1\FieldBag | Sammelt Blueprints, overrides `_attribute()`/`_relation()` |
| `WritableFieldBag` | V1\FieldBag | Exposiert `addField()` für `forOperation()` |
| `Type` | V1\Type | Override `created()` mit Blueprint-Split |
| `ModelType` | V2\Type | + Eloquent-Model + Auto-Resolver |
| `TypeConfigurator` | – | Api-Level Type-Konfiguration (only, readOnly, field) |
| `FieldConfigurator` | – | Feld-spezifische Konfiguration (required, validate) |

### Api-Level Konfiguration

Neben der Type-Definition selbst können Types auf Api-Ebene konfiguriert werden — ohne Subclassing. `configureType()` in der Api-Klasse gibt einen `TypeConfigurator` zurück:

```php
class DebitorApi extends Api
{
    protected function configureTypes(): void
    {
        $this->configureType(OrderType::class)
            ->only(['date', 'customer', 'settlement'])
            ->readOnly();
    }
}
```

Mehr dazu unter [Api-Level Type-Konfiguration](./api-konfiguration.md).

### Warum funktioniert das?

Die v2 `FieldBag` erbt alle Builder-Methoden von v1 (`->string()`, `->date()`, `->hasOne()`, `->linkOne()`, etc.). Diese rufen intern `_attribute()` bzw. `_relation()` auf — und genau diese Methoden überschreibt v2, um Blueprints statt v1 Fields zu erstellen.

Der Rest der v1-Infrastruktur (Api, Resource, Action, Resolver, Schema-Generierung, Client) arbeitet mit den drei resultierenden v1 FieldBags und merkt keinen Unterschied.

## Chaining-Mechanismus

Das Fluent-Interface funktioniert über einen `$lastField`-Cursor in der FieldBag:

```php
$fields
    ->string('name')    // (1) Erstellt Blueprint, setzt $lastField
    ->on(READ, UPDATE)  // (2) Delegiert an $lastField->on(...)
    ->onUpdate(...)     // (3) Delegiert an $lastField->onUpdate(...)

    ->string('email')   // (4) Neuer Blueprint, $lastField wechselt
    ->on(READ);         // (5) Gilt jetzt für 'email'
```

Alle Methoden die nach einem Field-Builder aufgerufen werden (`on`, `onMutation`, `onUpdate`, `onCreate`, `validate`, `required`, `default`, `resolve`, `restrictTo`) werden an das zuletzt erstellte Feld delegiert.
