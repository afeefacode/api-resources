Akteure
=======

API
***

Eine API beschreibt alle Möglichkeiten auf einen Datenbestand zuzugreifen ist grundsätzlich ein Set von Actions und Typen. APIs werden jedoch aus Flexibilitätsgründen genereller aus verschiedenen Resources zusammengestellt, die selbst themenspezifisch Actions und Typen gruppieren und bereitstellen. Für ein und dasselbe Projekt darf es mehrere APIs geben. Sie unterscheiden sich z.B.:

* Bedürfnis nach Authentifizierung und Authorisierung

  Z.B. kann es öffentliche Frontend-APIs geben und geschützte Backend-APIs.

* verfügbare Actions und Typen

  Nicht alle Actions oder Typen einer Backend-API sollen in einer Frontend-API angeboten werden.

* angepasste Actions und Typen

  Auf dem Fontend-API darf nicht geschrieben werden und bestimmte Metadaten (z.B. create_at) werden nicht ausgeliefert.

Konfiguration
#############

* Auswahl bestimmter Resources
* Konfiguration ausgewählter Resources
* Authentifizierung und Authorisierung einer API

**Beispiel**

.. code-block:: php

  class BlogApi extends Api
  {
      protected static string $type = 'Blog.Api';

      protected function resources(ResourceBag $resources): void
      {
          $resources
              ->add(ArticleResource::class)
              ->add(AuthorResource::class)
              ->add(CommmentResource::class);
              ->add(TagResource::class);
      }

      protected function types(TypeBag $types): void
      {
          $types
              ->add(Article::class)3
              ->add(Author::class)
              ->add(Comment::class)
              ->add(Tag::class);
      }

      protected function auth(Authenticator $authenticator): void
      {
          $authenticator
              ->set(AuthService::class);
      }
  }

Im Beispiel wird eine Blog-API angelegt, welche durch einen Authentifizierungs-Service geleitet wird. Die ausgewählten Resources stehen in voller Funktionalität zur Verfügung.

**Beispiel mit Konfiguration**

.. code-block:: php

  class BlogApi extends Api
  {
      protected static string $type = 'Blog.Api';

      protected function resources(ResourceBag $resources): void
      {
          $resources
              ->add(function (ArticleResource $resource) {
                  $resource->allow([
                    'list',
                    'get'
                  ])
              })
              ->add(AuthorResource::class)
              ->add(CommmentResource::class);
              ->add(TagResource::class);
      }
      ...

Auf der ArticleResource werden nur die Actions list und get erlaubt.

Resource
********

Eine Resource ist ein Set von inhaltlich zusammengehörigen Actions. In den meisten Fällen wird wohl ein Model mit seinen üblichen CRUD-Methoden zu einer Resource zusammengefasst werden.

**Beispiel**

.. code-block:: php

  class ArticleResource extends Resource
  {
      protected static string $type = 'Blog.ArticleResource';

      protected function actions(ActionBag $actions): void
      {
          $actions->add('list', function (Action $action) {
              ...
          });

          $actions->add('get', function (Action $action) {
              ...
          });

          $actions->add('create', function (Action $action) {
              ...
          });

          $actions->add('update', function (Action $action) {
              ...
          });

          $actions->add('delete', function (Action $action) {
              ...
          });
      }
  }

Action
******

Eine Action ist ein verfügbarer Endpunkt auf einer API. Eine Action kann beliebigen Code ausführen, insbesondere Daten lesen und schreiben.

**Beispiel**

.. code-block:: php

  class ArticleType extends Type
  {
      protected static string $type = 'Blog.Article';

      protected function fields(FieldBag $fields): void
      {
          $fields->attribute('title', VarcharAttribute::class);

          $fields->attribute('date', DateAttribute::class);

          $fields->attribute('summary', TextAttribute::class);

          $fields->attribute('content', TextAttribute::class);

          $fields->relation('author', AuthorType::class, function (LinkOneRelation $relation) {
              ...
          });

          $fields->relation('comments', CommentType::class, function (HasManyRelation $relation) {
              ...
          });

          $fields->relation('tags', TagType::class, function (LinkManyRelation $relation) {
              ...
          });
      }
  }

Params
######

Eine Action kann mit Parametern versehen werden. Diese können optional oder verpflichtend sein. Parameter sind wie Felder typisiert und können validiert werden. Ein falscher Parameter muss zu einem Fehler führen, die Action kann nicht durchgeführt werden.

* name
* type
* validator

Filter
######

Filter sind immer optional und schränken die durch die Action (und ihre Parameter) bestimmte Ergebnismenge weiter ein. Ein falscher Filter wird ignoriert und einfach nicht verwendet. Alle anderen Filter werden weiterhin verwendet. Die Liste aller genutzen Filter wird von einer Action zurückgegeben.

* name
* fixed options
* option request
* default value

Input
#####

Eine Mutation-Action kann einen Input erlauben. Der Input ist ein Typ und kann ein Typ-Modus sein (update, create, falls der Typ Modi enthält).

Response
########

Jede Action führt zu einer Response. Dies kann ein (fester oder variabler) Typ sein, eine Liste von (gleichen oder verschiedenen) Typen oder ein einfacher Rückgabewert.

Resolver
########

Resolver verknüpfen Actions mit der Persistenz-Schicht.

Type
****

Attribute
#########

Attribute sind nicht weiter filterbare einfache oder komplexere (Json) Datenfelder.

Relation
########

Relations sind Verknüpfungen zu anderen Typen.

Validator
#########

Wenn ein Typ als Input einer Action verwendet wird, können dessen Attribute und Relations validiert werden. Eine fehlgeschlagene Validierung soll die Action abbrechen.

Resolver
########

Resolver verknüpfen Attribute oder Relations mit der Persistenz-Schicht.
