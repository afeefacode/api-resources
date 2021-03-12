<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;

class FieldBag implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * @var array<Field>
     */
    public array $fields = [];

    public function add(string $name, $classOrCallback = null): FieldBag
    {
        if (is_callable($classOrCallback)) {
            $callback = $classOrCallback;
            $Field = $this->container->getCallbackArgumentType($callback);
            $this->container->add($Field); // register field class
            $this->container->create($Field, function (Field $field) use ($name, $callback) {
                $field->name = $name;
                $field->allowed = true;
                $callback($field);
                $this->fields[$name] = $field;
            });
        } else {
            $Field = $classOrCallback;
            $this->container->add($Field); // register field class
            $this->container->create($Field, function (Field $field) use ($name) {
                $field->name = $name;
                $field->allowed = true;
                $this->fields[$name] = $field;
            });
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
        $fieldBag = $this->container->create(FieldBag::class, function (FieldBag $fieldBag) {
            foreach ($this->fields as $name => $field) {
                $fieldBag->fields[$name] = $field->clone();
            }
        });
        return $fieldBag;
    }

    public function toSchemaJson(): array
    {
        return array_filter(array_map(function (Field $field) {
            if ($field->allowed) {
                return $field->toSchemaJson();
            }
            return null;
        }, $this->fields));
    }
}
