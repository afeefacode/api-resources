# GitHub Copilot instructions for afeefa/api-resources (summary)

Purpose: concise, actionable notes so an AI agent (or a new dev) can be productive quickly in this package.

## Big picture
- This project provides a framework to define multiple API resources for a single project (server + TypeScript client).
- Two main packages live here: `api-resources-server` (server helpers) and `api-resources-client` (TypeScript client library used by frontends).
- The client is written in TypeScript and published as an ES module + type definitions (`lib/es5`, `lib/types`).

## Key workflows & commands
- Client package scripts (examples):
  - `npm run dev` — watch + compile TypeScript (`tsc --watch -p tsconfig.build.json`).
  - `npm run build` — full TypeScript build (`tsc -p tsconfig.build.json`).
  - `npm test` — runs Jest tests (see `api-resources-client/package.json`).
- CI/publishing: there is a `.github/workflows/publish-to-npm.yml` in the client; check the workflow for publish credentials and tags when preparing releases.
- Docs & examples: a thorough set of docs is available at https://afeefa-api-resources.readthedocs.io and the generated client/server API docs under `docs/` / GitHub pages links.

## Project-specific conventions
- Client output: `module` points to compiled ES5 in `lib/es5` and `typings` to `lib/types/index.d.ts` — ensure builds produce both.
- Tests rely on Jest + ts-jest; prefer adding unit tests next to the TS source and using `npm test`.
- Keep the client API stable: follow semantic versioning and ensure `types` don't break across minor releases.

## Integration & external dependencies
- Client uses `axios` for HTTP; server expects standard REST conventions used across Kollektiv frontend packages.
- CI/CD publishing may depend on npm tokens and tagging conventions — inspect the workflow YAML before publishing.

## Common gotchas / shortcuts
- If type errors appear during `npm run build`, run `npm run dev` (watch mode) to get continuous feedback and faster fixes.
- When adding client exports, regenerate builds and confirm `lib/types` contains accurate type maps.

## Where to look when asked to change code
- Client build & tests: `api-resources-client/package.json`, `api-resources-client/tsconfig.build.json`, `api-resources-client/src`.
- Server helpers: `api-resources-server/src` and the top-level `docs/` for usage examples.

---
If you'd like, I can add a short release checklist (tagging, CHANGELOG, publish) or a sample PR template for API changes. ✅