<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Bag\Bag;

/**
 * @property Field[] $entries
 */
class FieldBag extends Bag
{
    public function add(string $name, $classOrCallback): FieldBag
    {
        [$Field, $callback] = $this->resolveCallback($classOrCallback);

        $this->container->add($Field); // register field class

        $this->container->create($Field, function (Field $field) use ($name, $callback) {
            $field
                ->name($name)
                ->allowed(true);
            if ($callback) {
                $callback($field);
            }
            $this->entries[$name] = $field;
        });

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
        return $this->entries[$name];
    }

    public function allow(array $names): FieldBag
    {
        foreach ($names as $name) {
            $this->entries[$name]->allowed(true);
        }
        return $this;
    }

    public function clone(): FieldBag
    {
        return $this->container->create(FieldBag::class, function (FieldBag $fieldBag) {
            foreach ($this->entries as $name => $field) {
                $fieldBag->entries[$name] = $field->clone();
            }
        });
    }

    public function toSchemaJson(): array
    {
        return array_filter(array_map(function (Field $field) {
            if ($field->isAllowed()) {
                return $field->toSchemaJson();
            }
            return null;
        }, $this->entries));
    }
}
