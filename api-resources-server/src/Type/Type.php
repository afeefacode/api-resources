<?php

namespace Afeefa\ApiResources\Type;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Relation\RelationBag;

class Type implements ToSchemaJsonInterface
{
    public string $type = 'Afeefa.Type';

    protected FieldBag $fields;
    protected FieldBag $updateFields;
    protected FieldBag $createFields;

    protected RelationBag $relations;

    public function __construct()
    {
        $this->fields = new FieldBag();
        $this->fields($this->fields);

        $this->updateFields = $this->fields->clone();
        $this->updateFields($this->updateFields);

        $this->createFields = $this->updateFields->clone();
        $this->createFields($this->createFields);

        $this->relations = new RelationBag();
        $this->relations($this->relations);
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
            'update_fields' => $this->updateFields->toSchemaJson($visitor),
            'create_fields' => $this->createFields->toSchemaJson($visitor),
            'relations' => $this->relations->toSchemaJson($visitor)
        ];
    }
}
