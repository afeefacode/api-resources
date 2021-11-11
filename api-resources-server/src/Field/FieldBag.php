<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Api\TypeRegistry;
use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\Bag\BagEntryInterface;
use Closure;

/**
 * @method Field get(string $name)
 * @method Field[] getEntries()
 */
class FieldBag extends Bag
{
    protected ?FieldBag $original = null;

    public function original(FieldBag $fieldBag): FieldBag
    {
        $this->original = $fieldBag;
        return $this;
    }

    public function get(string $name, Closure $callback = null): Field
    {
        if ($this->original && !$this->has($name)) {
            $field = $this->original->get($name)->clone();
            $this->setInternal($name, $field);
        }

        return parent::get($name, $callback);
    }

    public function getRelation(string $name, Closure $callback = null): Relation
    {
        return $this->get($name, $callback);
    }

    /**
     * disabled
     */
    public function set(string $name, BagEntryInterface $value): Bag
    {
        return $this;
    }

    public function attribute(string $name, $classOrCallback): FieldBag
    {
        $this->container->create($classOrCallback, function (Attribute $attribute) use ($name) {
            $attribute
                ->name($name)
                ->allowed(true);
            $this->setInternal($name, $attribute);
        });

        return $this;
    }

    public function relation(string $name, $TypeClassOrClassesOrMeta, $classOrCallback): FieldBag
    {
        $this->container->create($classOrCallback, function (Relation $relation) use ($name, $TypeClassOrClassesOrMeta) {
            $relation
                ->name($name)
                ->allowed(true)
                ->typeClassOrClassesOrMeta($TypeClassOrClassesOrMeta);
            $this->setInternal($name, $relation);
        });

        return $this;
    }

    public function allow(array $names): FieldBag
    {
        // disallow own fields of this bag
        foreach (array_values($this->getEntries()) as $field) {
            if (!in_array($field->getName(), $names)) {
                $field->allowed(false);
            }
        }

        // allow all allowed fields
        foreach ($names as $name) {
            if (!$this->has($name)) {
                if (preg_match('/^(.+)#(add|delete|update)$/', $name, $matches)) {
                    $baseRelationName = $matches[1];
                    $adds = $matches[2] === 'add';
                    $deletes = $matches[2] === 'delete';
                    $updates = $matches[2] === 'update';
                    $relation = $this->getRelation($baseRelationName)
                        ->clone()
                        ->allowed(true)
                        ->updatesItems($updates)
                        ->addsItems($adds)
                        ->deletesItems($deletes);
                    $this->setInternal($name, $relation);
                    continue;
                }
            }
            $this->get($name)->allowed(true);
        }
        return $this;
    }

    public function getEntrySchemaJson(Field $field, TypeRegistry $typeRegistry): ?array
    {
        $typeRegistry->registerField(get_class($field));
        if ($field->isAllowed()) {
            return $field->toSchemaJson();
        }
        return null;
    }
}
