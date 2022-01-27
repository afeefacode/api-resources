<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\Bag\BagEntryInterface;
use Closure;

/**
 * @method Field get(string $name)
 * @method Field[] getEntries()
 */
class FieldBag extends Bag
{
    protected $owner;

    protected ?FieldBag $original = null;

    public function owner($owner): FieldBag
    {
        $this->owner = $owner;
        return $this;
    }

    public function getOwner()
    {
        if ($this->original) {
            return $this->original->getOwner();
        }

        return $this->owner;
    }

    public function original(FieldBag $fieldBag): FieldBag
    {
        $this->original = $fieldBag;
        return $this;
    }

    public function has(string $name, bool $ownFields = false): bool
    {
        if ($this->original && !$this->hasInternal($name) && !$ownFields) {
            return $this->original->has($name);
        }

        return parent::has($name);
    }

    public function get(string $name, Closure $callback = null): Field
    {
        if ($this->original && !$this->hasInternal($name)) {
            $field = $this->original->get($name)->clone();
            $this->setInternal($name, $field);
        }

        return parent::get($name, $callback);
    }

    public function getAttribute(string $name, Closure $callback = null): Attribute
    {
        return $this->get($name, $callback);
    }

    public function getRelation(string $name, Closure $callback = null): Relation
    {
        return $this->get($name, $callback);
    }

    public function getOriginal(): ?FieldBag
    {
        return $this->original;
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
                ->owner($this->getOwner())
                ->name($name);
            $this->setInternal($name, $attribute);
        });

        return $this;
    }

    public function relation(string $name, $TypeClassOrClassesOrMeta, $classOrCallback = Relation::class): FieldBag
    {
        $this->container->create($classOrCallback, function (Relation $relation) use ($name, $TypeClassOrClassesOrMeta) {
            $relation
                ->owner($this->getOwner())
                ->name($name)
                ->typeClassOrClassesOrMeta($TypeClassOrClassesOrMeta);
            $this->setInternal($name, $relation);
        });

        return $this;
    }

    public function from(FieldBag $fromFields, string $name, Closure $callback = null): FieldBag
    {
        $field = $fromFields->get($name)->clone();
        $this->setInternal($name, $field);
        if ($callback) {
            $callback($field);
        }
        return $this;
    }

    public function getEntrySchemaJson(Field $field): ?array
    {
        return $field->toSchemaJson();
    }
}
