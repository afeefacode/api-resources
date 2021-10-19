Typen und Models
================

Typen sind Blaupausen oder Bildungsvorschriften für Models. Typen beschreiben die möglichen Attribute und Relationen von Models.

Typen beschreiben die Regeln zur Erstellung und Änderung von Models. Zu diesen Regeln gehören Sichtbarkeiten und Wertebereiche von Attributen und Relationen.

Resolver verknüpfen die definierten Attributen und Relationen mit der Implentierung slogik ihrer Persistierung.

Attribute
*********

Attribute sind Felder, die einfache Daten aufnehmen, die nicht durch einen expliziten, strukturierten Typen beschrieben werden und damit auch nicht weiter filterbar sind. Komplexere unstrukturierte Daten können jedoch in den Typen Object oder Array abgelegt werden.

* String
* Int
* Number
* Boolean
* Date
* Enum
* Object, Array
* ID

Jedes Attribut erlaubt den Wert ``null``, um die Absenz von Daten zu signalisieren. Ein Client muss das berücksichtigen, wenn er z.B. Enum-Attribute einliest.

Beim Erzeugen einer neuen Instanz eines Typs kann ein Defaultwert konfiguriert werden.

.. list-table:: Attribute types
   :widths: auto
   :header-rows: 1

   * - Type

     - Default value

   * - Varchar, Text

     - ``''``

   * - Int

     - 0


Relations
*********

Eine Relation gibt an, dass sich hinter einem Feld eine oder mehrere Typen verbergen, die weiter gefiltert werden können.

Eine Relation besitzt stets eine Multiplizität: Sie ist singulär oder multiple. Singuläre Relationen erlauben den Wert ``null``, leere multiple Relationen gegen stets ein leeres Array ``[]`` zurück.

.. code-block:: php

  protected function fields(FieldBag $fields): void
  {
      $fields->relation('related_objects');
  }
