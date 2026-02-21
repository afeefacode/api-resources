# Api-Level Type-Konfiguration

## Das Problem

V2 Types sind generisch und wiederverwendbar. Oft braucht man aber pro Projekt oder Rolle eine andere Sicht auf denselben Type:

- **Projekt 1** will `date_birth` als Pflichtfeld, **Projekt 2** will `phone` als Pflichtfeld
- Ein **Debitor-Portal** soll nur 10 von 45 Feldern sehen und nichts ändern dürfen
- Eine **OFEK-Api** fügt Felder hinzu *und* passt Validierung an

Die naheliegende Lösung — Type-Subclasses pro Projekt oder Rolle — führt zu Explosion: `DebitorOrderType`, `DebitorSprintType`, `Projekt1PersonType`, `Projekt2PersonType`, ...

## Die Lösung: `configureType()`

Die Api kann Types konfigurieren, ohne sie zu subclassen. In `configureTypes()` werden die Konfigurationen deklarativ festgelegt:

```php
class DebitorApi extends Api
{
    protected function configureTypes(): void
    {
        $this->configureType(OrderType::class)
            ->only(['date', 'language', 'customer', 'orderer'])
            ->readOnly();
    }
}
```

Die Konfiguration wird automatisch beim Erzeugen des Schema-JSON angewendet — `OrderType` selbst bleibt unverändert.

## Methoden

### `configureType(string $typeClass): TypeConfigurator`

Gibt einen `TypeConfigurator` für den angegebenen Type zurück. Mehrere Aufrufe für denselben Type liefern immer denselben Configurator zurück.

```php
protected function configureTypes(): void
{
    $this->configureType(PersonType::class)
        ->field('date_birth')->onMutation(required: true);
}
```

### `TypeConfigurator::only(array $fieldNames): static`

Schränkt den Type auf ein Subset von Feldern ein. Felder, die nicht in der Liste sind, werden aus READ, UPDATE und CREATE entfernt.

```php
$this->configureType(OrderType::class)
    ->only(['date', 'language', 'customer', 'orderer', 'settlement']);
```

### `TypeConfigurator::readOnly(): static`

Entfernt alle UPDATE- und CREATE-Felder. Der Type ist danach nur noch lesbar.

```php
$this->configureType(OrderType::class)
    ->readOnly();
```

### `TypeConfigurator::field(string $name): FieldConfigurator`

Wählt ein Feld für Konfiguration aus. Gibt einen `FieldConfigurator` zurück — **kein weiteres Chaining auf TypeConfigurator**.

```php
$this->configureType(PersonType::class)
    ->field('date_birth')->onMutation(required: true);
```

### `FieldConfigurator::onMutation(?callable $validate, ?bool $required): static`

Setzt Konfiguration für UPDATE **und** CREATE gleichzeitig.

```php
->field('name')->onMutation(required: true)
->field('email')->onMutation(validate: fn(StringValidator $v) => $v->filled())
```

### `FieldConfigurator::onUpdate(?callable $validate, ?bool $required): static`

Nur für UPDATE.

### `FieldConfigurator::onCreate(?callable $validate, ?bool $required): static`

Nur für CREATE.

## Anwendungsfälle

### Rollen-Einschränkung (only + readOnly)

```php
class DebitorApi extends Api
{
    protected function configureTypes(): void
    {
        $this->configureType(OrderType::class)
            ->only([
                'date', 'language', 'customer', 'orderer', 'debitor',
                'accepted_or_withdrawn_canceled_sprint', 'settlement',
                'appointments', 'appointment_type', 'order_status',
            ])
            ->readOnly();

        $this->configureType(SprintType::class)
            ->only(['note', 'person'])
            ->readOnly();
    }
}
```

Kein `DebitorOrderType` oder `DebitorSprintType` mehr nötig.

### Projektspezifische Validierung

```php
// Projekt 1: Geburtstag Pflicht
class Projekt1Api extends Api
{
    protected function configureTypes(): void
    {
        $this->configureType(PersonType::class)
            ->field('date_birth')->onMutation(required: true);
    }
}

// Projekt 2: Telefon Pflicht
class Projekt2Api extends Api
{
    protected function configureTypes(): void
    {
        $this->configureType(PersonType::class)
            ->field('phone')->onMutation(required: true);
    }
}
```

### Kombination

```php
class DebitorProjekt1Api extends Api
{
    protected function configureTypes(): void
    {
        // Rollen-Einschränkung
        $this->configureType(OrderType::class)
            ->only(['date', 'language', 'customer'])
            ->readOnly();

        // Projekt-Validierung
        $this->configureType(PersonType::class)
            ->field('date_birth')->onMutation(required: true);
    }
}
```

### Kombination mit `overrideTypes()`

Wenn Fields *hinzugefügt* werden müssen, bleibt `overrideTypes()` sinnvoll. Beide Mechanismen ergänzen sich:

```php
class OfekApi extends Api
{
    // Fields hinzufügen → weiterhin via Type-Vererbung
    protected function overrideTypes(): array
    {
        return [ClientType::type() => OfekClientType::class];
    }

    // Validierung anpassen → Api-Level
    protected function configureTypes(): void
    {
        $this->configureType(PersonType::class)
            ->field('date_birth')->onMutation(required: true);
    }
}
```

## Abgrenzung

| Mechanismus | Zweck |
|-------------|-------|
| `configureType()->only()` | Feld-Subset sichtbar machen |
| `configureType()->readOnly()` | Mutations deaktivieren |
| `configureType()->field()->onMutation()` | Validierung/Required überschreiben |
| `overrideTypes()` | Fields hinzufügen oder Type komplett ersetzen |
| Resource `scope()` | *Welche* Datensätze sichtbar sind (Datenbank-Ebene) |

::: tip
`configureType()` wirkt auf das Schema-JSON. Es kontrolliert, welche Felder der Client sieht und welche Mutations er ausführen kann. Die Datensatz-Filterung (welche Rows zurückgegeben werden) gehört in `Resource::scope()`.
:::
