<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\Relation\Relations\HasMany;
use Afeefa\ApiResources\Relation\Relations\HasOne;
use Afeefa\ApiResources\Relation\Relations\LinkMany;
use Afeefa\ApiResources\Relation\Relations\LinkOne;

/**
 * @property Relation[] $entries
 */
class RelationBag extends Bag
{
    public function hasOne(string $name, string $RelatedType, callable $callback = null): Relation
    {
        return $this->add($name, $RelatedType, HasOne::class, $callback);
    }

    public function hasMany(string $name, string $RelatedType, callable $callback = null): Relation
    {
        return $this->add($name, $RelatedType, HasMany::class, $callback);
    }

    public function linkOne(string $name, string $RelatedType, callable $callback = null): Relation
    {
        return $this->add($name, $RelatedType, LinkOne::class, $callback);
    }

    public function linkMany(string $name, string $RelatedType, callable $callback = null): Relation
    {
        return $this->add($name, $RelatedType, LinkMany::class, $callback);
    }

    public function add(string $name, string $RelatedType, string $Relation, callable $callback = null): Relation
    {
        $this->container->add($Relation); // register relation class
        $relation = $this->container->create($Relation, function (Relation $relation) use ($name, $RelatedType, $callback) {
            $relation
                ->name($name)
                ->relatedType($RelatedType);

            if ($callback) {
                $callback($relation);
            }
            $this->entries[$name] = $relation;
        });
        return $relation;
    }
}
