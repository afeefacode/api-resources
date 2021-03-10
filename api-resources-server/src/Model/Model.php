<?php

namespace Afeefa\ApiResources\Model;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Relation\RelationBag;

class Model implements ToSchemaJsonInterface
{
    public string $type = 'Afeefa.Model';

    protected FieldBag $fields;
    protected RelationBag $relations;

    public function __construct()
    {
        $fields = new FieldBag();
        $this->fields($fields);
        $this->fields = $fields;

        $relations = new RelationBag();
        $this->relations($relations);
        $this->relations = $relations;
    }

    public function fields(FieldBag $fields): void
    {
    }

    public function updateFields(FieldBag $fields): void
    {
    }

    public function createFields(FieldBag $fields): void
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
