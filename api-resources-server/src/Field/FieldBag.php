<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackArgumentException;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeHintException;
use ReflectionFunction;

class FieldBag implements ToSchemaJsonInterface
{
    /**
     * @var array<Field>
     */
    public array $fields = [];

    public function add(string $name, $classOrCallback = null): FieldBag
    {
        if (is_callable($classOrCallback)) {
            $callback = $classOrCallback;
            $f = new ReflectionFunction($callback);
            $param = $f->getParameters()[0] ?? null;
            if ($param) {
                /** @var ReflectionNamedType */
                $type = $param->getType();
                if ($type) {
                    $Field = $type->getName();
                    $field = new $Field();
                    $field->name = $name;
                    $field->allowed = true;
                    $callback($field);
                    $this->fields[$name] = $field;
                } else {
                    throw new MissingTypeHintException("Field {$name}'s callback variable \${$param->getName()} does provide a type hint.");
                }
            } else {
                throw new MissingCallbackArgumentException("Field {$name}'s callback does not provide an argument.");
            }
        } else {
            $Field = $classOrCallback;
            $field = new $Field();
            $field->name = $name;
            $field->allowed = true;
            $this->fields[$name] = $field;
        }

        return $this;
    }

    public function update(string $name, callable $callback): FieldBag
    {
        $field = $this->fields[$name];
        $callback($field);
        return $this;
    }

    public function get(string $name): Field
    {
        return $this->fields[$name];
    }

    public function allow(array $names): FieldBag
    {
        foreach ($names as $name) {
            $this->fields[$name]->allowed = true;
        }
        return $this;
    }

    public function clone(): FieldBag
    {
        $fieldBag = new FieldBag();
        foreach ($this->fields as $name => $field) {
            $fieldBag->fields[$name] = $field->clone();
        }
        return $fieldBag;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        return array_filter(array_map(function (Field $field) use ($visitor) {
            if ($field->allowed) {
                return $field->toSchemaJson($visitor);
            }
            return null;
        }, $this->fields));
    }
}
