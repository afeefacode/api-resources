<?php

namespace Afeefa\ApiResources\Type;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Relation\RelationBag;

class Type implements ToSchemaJsonInterface
{
    public string $type = 'Afeefa.Type';

    public FieldBag $fields;
    public RelationBag $relations;

    public function __construct()
    {
        $this->fields = new FieldBag();
        $this->fields($this->fields);

        $this->relations = new RelationBag();
        $this->relations($this->relations);
    }

    public function fields(FieldBag $fields): void
    {
    }

    public function relations(RelationBag $relations): void
    {
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        return [
            // 'type' => $this->type,
            'fields' => $this->fields->toSchemaJson($visitor),
            'relations' => $this->relations->toSchemaJson($visitor)
        ];
    }
}
