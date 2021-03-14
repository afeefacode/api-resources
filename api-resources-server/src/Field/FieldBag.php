<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Bag\Bag;

/**
 * @property Field[] $entries
 */
class FieldBag extends Bag
{
    // protected array $entries = [];

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
                $this->entries[$name] = $field;
            });
        } else {
            $Field = $classOrCallback;
            $this->container->add($Field); // register field class
            $this->container->create($Field, function (Field $field) use ($name) {
                $field->name = $name;
                $field->allowed = true;
                $this->entries[$name] = $field;
            });
        }

        return $this;
    }

    public function update(string $name, callable $callback): FieldBag
    {
        $field = $this->entries[$name];
        $callback($field);
        return $this;
    }

    public function get(string $name): Field
    {
        return parent::get($name);
    }

    public function allow(array $names): FieldBag
    {
        foreach ($names as $name) {
            $this->entries[$name]->allowed = true;
        }
        return $this;
    }

    public function clone(): FieldBag
    {
        $fieldBag = $this->container->create(FieldBag::class, function (FieldBag $fieldBag) {
            foreach ($this->entries as $name => $field) {
                $fieldBag->entries[$name] = $field->clone();
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
        }, $this->entries));
    }

    protected function includeInSchema(Field $field): bool
    {
        return $field->allowed;
    }
}
