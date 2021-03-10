<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Field\Fields\BooleanField;
use Afeefa\ApiResources\Field\Fields\DateField;
use Afeefa\ApiResources\Field\Fields\IdField;
use Afeefa\ApiResources\Field\Fields\TextField;
use Afeefa\ApiResources\Field\Fields\VarcharField;

class FieldBag implements ToSchemaJsonInterface
{
    /**
     * @var array<Field>
     */
    public array $fields = [];

    public function id(string $name, callable $callback = null): IdField
    {
        return $this->field($name, IdField::class, $callback);
    }

    public function boolean(string $name, callable $callback = null): BooleanField
    {
        return $this->field($name, BooleanField::class, $callback);
    }

    public function varchar(string $name, callable $callback = null): VarcharField
    {
        return $this->field($name, VarcharField::class, $callback);
    }

    public function text(string $name, callable $callback = null): TextField
    {
        return $this->field($name, TextField::class, $callback);
    }

    public function date(string $name, callable $callback = null): DateField
    {
        return $this->field($name, DateField::class, $callback);
    }

    public function field(string $name, string $Field, callable $callback = null): Field
    {
        $field = new $Field();
        $field->name = $name;
        if ($callback) {
            $callback($field);
        }
        $this->fields[$name] = $field;
        return $field;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        // return array_map(function (Field $field) use ($visitor) {
        //     return $field->toSchemaJson($visitor);
        // }, $this->fields);

        $fields = [];

        foreach ($this->fields as $name => $field) {
            $fields[$name] = $field->toSchemaJson($visitor);
        }

        return $fields;
    }
}
