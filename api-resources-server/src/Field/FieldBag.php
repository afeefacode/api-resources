<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Api\TypeRegistry;
use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\DI\Resolver;
use Closure;

/**
 * @method Field get(string $name)
 * @method Field[] entries()
 */
class FieldBag extends Bag
{
    public function add(string $name, $classOrCallback): FieldBag
    {
        $this->container->create($classOrCallback, function (Resolver $r) use ($name) {
            $r->resolved(function (Field $field) use ($name) {
                $field
                    ->name($name)
                    ->allowed(true);
                $this->set($name, $field);
            });
        });

        return $this;
    }

    public function update(string $name, Closure $callback): FieldBag
    {
        $field = $this->get($name);
        $callback($field);
        return $this;
    }

    public function allow(array $names): FieldBag
    {
        foreach ($names as $name) {
            $this->get($name)->allowed(true);
        }
        return $this;
    }

    public function clone(): FieldBag
    {
        return $this->container->create(function (FieldBag $fieldBag) {
            foreach ($this->entries() as $name => $field) {
                $fieldBag->set($name, $field->clone());
            }
        });
    }

    public function toSchemaJson(): array
    {
        return array_filter(array_map(function (Field $field) {
            $this->container->get(function (TypeRegistry $typeRegistry) use ($field) {
                $typeRegistry->registerField(get_class($field));
            });

            if ($field->isAllowed()) {
                return $field->toSchemaJson();
            }
            return null;
        }, $this->entries()));
    }
}
