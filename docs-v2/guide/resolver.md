# Resolver & Options

## Custom Resolver

Standardmäßig nutzt `ModelType` automatische Eloquent-Resolver für Relationen. Für berechnete Felder oder spezielle Logik kann ein eigener Resolver angegeben werden:

```php
->number('summary')->on(READ)
    ->resolve([CostResolver::class, 'resolve_summary'])
```

### Resolver mit Parametern

```php
->number('total_with_tax')->on(READ)
    ->resolve([CostResolver::class, 'resolve_cost'], ['include_tax' => true])
```

### Relation-Resolver

```php
->hasOne('primary_contact', PersonType::class)->on(READ)
    ->resolve([CustomerResolver::class, 'resolve_primary_contact'])
```

::: info Auto-Resolver
`V2\ModelType` registriert automatisch Eloquent-Resolver für alle Relationen, die keinen expliziten Resolver haben. Du musst nur dann `->resolve()` angeben, wenn die Standard-Logik nicht reicht.
:::

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
