<?php

namespace Afeefa\ApiResources\Type;

use Afeefa\ApiResources\Field\FieldBag;

class ModelType extends Type
{
    protected static string $type = 'Afeefa.ModelType';

    public static string $ModelClass;

    protected FieldBag $updateFields;

    protected FieldBag $createFields;

    public function created(): void
    {
        parent::created();

        $this->updateFields = $this->fields->clone();
        $this->updateFields($this->updateFields);

        $this->createFields = $this->updateFields->clone();
        $this->createFields($this->createFields);
    }

    public function getUpdateFields(): FieldBag
    {
        return $this->updateFields;
    }

    public function getCreateFields(): FieldBag
    {
        return $this->createFields;
    }

    public function getAllValidatorClasses(): array
    {
        $ValidatorClasses = parent::getAllValidatorClasses();

        foreach ($this->updateFields->getEntries() as $field) {
            if ($ValidatorClass = $field->getValidatorClass()) {
                $ValidatorClasses[] = $ValidatorClass;
            }
        }

        foreach ($this->createFields->getEntries() as $field) {
            if ($ValidatorClass = $field->getValidatorClass()) {
                $ValidatorClasses[] = $ValidatorClass;
            }
        }

        return $ValidatorClasses;
    }

    public function toSchemaJson(): array
    {
        $json = parent::toSchemaJson();

        $json = $this->insertAfter('fields', $json, 'update_fields', $this->updateFields->toSchemaJson());
        $json = $this->insertAfter('update_fields', $json, 'create_fields', $this->createFields->toSchemaJson());

        return $json;
    }

    protected function updateFields(FieldBag $fields): void
    {
    }

    protected function createFields(FieldBag $fields): void
    {
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
