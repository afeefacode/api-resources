<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\DI\Injector;
use Closure;

/**
 * @property Field[] $entries
 */
class FieldBag extends Bag
{
    public function add(string $name, $classOrCallback): FieldBag
    {
        [$Field, $callback] = $this->classOrCallback($classOrCallback);

        $init = function (Field $field) use ($name) {
            $field
                ->name($name)
                ->allowed(true);
            $this->entries[$name] = $field;
        };

        if ($Field) {
            $this->container->create($Field, null, $init);
        }

        if ($callback) {
            $this->container->call(
                $callback,
                function (Injector $i) {
                    $i->create = true;
                },
                $init
            );
        }

        return $this;
    }

    public function update(string $name, Closure $callback): FieldBag
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
        return $this->container->create(FieldBag::class, null, function (FieldBag $fieldBag) {
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
