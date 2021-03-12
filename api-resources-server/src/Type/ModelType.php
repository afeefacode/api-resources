<?php

namespace Afeefa\ApiResources\Type;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Field\FieldBag;

class ModelType extends Type
{
    public string $type = 'Afeefa.ModelType';

    protected FieldBag $updateFields;
    protected FieldBag $createFields;

    public function __construct()
    {
        parent::__construct();

        $this->updateFields = $this->fields->clone();
        $this->updateFields($this->updateFields);

        $this->createFields = $this->updateFields->clone();
        $this->createFields($this->createFields);
    }

    public function updateFields(FieldBag $fields): void
    {
    }

    public function createFields(FieldBag $fields): void
    {
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $json = parent::toSchemaJson($visitor);

        $json = $this->insertAfter('fields', $json, 'update_fields', $this->updateFields->toSchemaJson($visitor));
        $json = $this->insertAfter('update_fields', $json, 'create_fields', $this->createFields->toSchemaJson($visitor));

        return $json;
    }

    private function insertAfter($afterKey, array $array, $newKey, $newValue)
    {
        $new = [];
        foreach ($array as $k => $value) {
            $new[$k] = $value;
            if ($k === $afterKey) {
                $new[$newKey] = $newValue;
            }
        }
        return $new;
    }
}
