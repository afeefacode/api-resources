# DI Container

Der `Container` ist der Dependency-Injection-Kern von api-resources. Er verwaltet Singletons, erzeugt neue Instanzen und injiziert sich selbst in alle `ContainerAware`-Objekte.

**Namespace:** `Afeefa\ApiResources\DI\Container`

## Übersicht

| Methode | Zweck |
|---------|-------|
| `get(string $TypeClass)` | Singleton aus dem Container holen (erzeugt bei Bedarf) |
| `create($classOrCallback, $cb)` | Neue Instanz erzeugen — **nicht** im Container speichern |
| `call(callable $callback)` | Singletons per Typ-Hint auflösen und Callback ausführen |
| `has(string $TypeClass)` | Prüfen ob ein Singleton registriert ist |
| `registerAlias(object, string)` | Instanz unter anderem Schlüssel registrieren |
| `entries()` | Alle registrierten Singletons zurückgeben |

## get() — Singleton

Gibt eine Instanz zurück, die im Container als Singleton lebt. Beim ersten Aufruf wird die Instanz erzeugt und dauerhaft registriert.

```php
$api = $container->get(BackendApi::class);

// zweiter Aufruf gibt dieselbe Instanz zurück
$api === $container->get(BackendApi::class); // true
```

**Voraussetzung:** Die Klasse muss instanziierbar sein (kein Interface, kein abstract). Schnittstellen können über [Config](#config-konstruktor) einem konkreten Objekt zugeordnet werden.

## create() — Neue Instanz

Erzeugt eine neue Instanz ohne sie zu registrieren. Zwei Varianten:

### Klassen-String

```php
$validator = $container->create(StringValidator::class, function (StringValidator $v) {
    $v->min(2)->max(100);
});
```

Der optionale zweite Parameter ist ein `resolveCallback` — er bekommt die erzeugte Instanz übergeben.

### Closure mit Typ-Hint

```php
$attribute = $container->create(function (StringAttribute $attr) {
    $attr->required();
});
```

Der erste Typ-Hint der Closure bestimmt die zu erzeugende Klasse. Die Closure wird als Konfigurationsschritt direkt nach der Erzeugung ausgeführt.

### Reihenfolge bei create()

Wenn eine Instanz `ContainerAwareInterface` implementiert:

```
new $TypeClass()
  → $instance->container($this)   // Container injizieren
  → register() falls $register=true
  → $instance->created()          // Initialisierungshook
  → $callback($instance)          // Closure aus Arg 1
  → $resolveCallback($instance)   // Closure aus Arg 2
```

## call() — Singletons auflösen und aufrufen

Löst alle Typ-Hints des Callbacks als Singletons auf und ruft ihn auf:

```php
$result = $container->call(function (BackendApi $api) use ($input) {
    return $api->requestFromInput($input);
});
```

Alle Parameter müssen Typ-Hints auf bekannte Klassen haben. Die Rückgabe des Callbacks wird weitergegeben.

::: tip Wann get() vs. call()?
- `get()` direkt: wenn genau eine bekannte Klasse gebraucht wird
- `call()`: wenn mehrere Singletons auf einmal injiziert werden sollen, oder wenn der Aufruf-Scope gut eingekapselt sein soll
:::

## Config — Konstruktor

Im Konstruktor können vorkonfigurierte Instanzen übergeben werden:

```php
$container = new Container([
    ContainerInterface::class => $existingInstance,
]);
```

Beim ersten `get(ContainerInterface::class)` wird `$existingInstance` zurückgegeben (nicht neu erzeugt). Sinnvoll um z.B. einen Wrapper-Container unter einem Interface-Schlüssel einzuhängen.

## ContainerAwareInterface

Klassen die `ContainerAwareInterface` (via `ContainerAwareTrait`) implementieren:

- bekommen bei `create()` und `get()` automatisch den Container injiziert
- der `created()` Hook wird nach der Injektion und Registrierung aufgerufen

```php
class MyBag implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    public function created(): void
    {
        // $this->container ist hier bereits gesetzt
        $this->someService = $this->container->get(SomeService::class);
    }
}
```

## registerAlias()

Registriert eine bereits existierende Instanz unter einem anderen Schlüssel:

```php
$container->registerAlias($concreteInstance, SomeInterface::class);

// jetzt per Interface abrufbar
$container->get(SomeInterface::class); // === $concreteInstance
```

## has()

```php
if ($container->has(CacheService::class)) {
    $cache = $container->get(CacheService::class);
}
```

## Hilfsfunktionen

Drei globale Funktionen in `Afeefa\ApiResources\DI\`:

| Funktion | Beschreibung |
|----------|-------------|
| `classOrCallback($x)` | Gibt `[$TypeClass, null]` oder `[null, $closure]` zurück |
| `getCallbackArgumentTypes(Closure, $min, $max)` | Gibt Array aller Typ-Hint-Klassen zurück |
| `getCallbackArgumentType(Closure)` | Gibt genau einen Typ-Hint zurück (min=1, max=1) |

Diese Funktionen werden intern von `create()` und `call()` genutzt und sind auch außerhalb des Containers verwendbar — z.B. in Resolver-Infrastruktur um den Klassen-Typ aus einer Callback-Signatur zu lesen.
