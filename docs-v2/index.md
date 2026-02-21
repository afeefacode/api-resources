---
layout: home

hero:
  name: API Resources v2
  text: Type-Definitionen ohne Redundanz
  tagline: Eine fields()-Methode statt drei. Gleiche Infrastruktur.
  actions:
    - theme: brand
      text: Getting Started
      link: /guide/getting-started
    - theme: alt
      text: Migration v1 → v2
      link: /guide/migration

features:
  - title: Eine fields()-Methode
    details: Alle Felder zentral definieren mit ->on(READ, UPDATE, CREATE) statt drei separaten Methoden.
  - title: Volle v1-Kompatibilität
    details: V2 Types erzeugen identisches Schema-JSON. Bestehende Resources, Actions, Resolver und Client funktionieren unverändert.
  - title: Schrittweise Migration
    details: Type für Type migrieren. V1 und v2 Types koexistieren im selben Projekt.
---
