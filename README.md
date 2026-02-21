# afeefa/api-resources

Create multiple APIs for the same project.

## Documentation

See the examples below for inspiration and head over to the documentation pages:

* [Read the Docs](https://afeefa-api-resources.readthedocs.io) on installation, configuration and usage.
* the [Server API Documentation](https://afeefacode.github.io/api-resources/server-api)
* the [Client API Documentation](https://afeefacode.github.io/api-resources/client-api)

## v2 Developer Documentation

Die v2-Entwicklerdoku liegt in `docs-v2/` und nutzt [VitePress](https://vitepress.dev/).

```bash
cd docs-v2
npm install
npm run dev       # Dev-Server starten (http://localhost:5173)
npm run build     # Statisches HTML erzeugen
```

Inhalt: Getting Started, Attribute & Validierung, Relationen & Modi, Resolver, Migration v1 → v2, API-Referenz.

## v2 Tests

Die v2-Tests liegen in `api-resources-server/tests-v2/` und nutzen PHPUnit 12 in einem Docker-Container (PHP 8.3).

```bash
cd api-resources-server/tests-v2
composer install    # einmalig (im Docker: --ignore-platform-req=ext-mbstring)
composer test       # Tests ausführen
./phpunit           # alternativ
./phpunit --filter=V2TypeTest   # einzelne Test-Klasse
```
