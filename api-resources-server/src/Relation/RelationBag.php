<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Relation\Relations\HasMany;
use Afeefa\ApiResources\Relation\Relations\HasOne;
use Afeefa\ApiResources\Relation\Relations\LinkMany;
use Afeefa\ApiResources\Relation\Relations\LinkOne;

class RelationBag implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * @var array<Relation>
     */
    public array $relations = [];

    public function hasOne(string $name, string $RelatedType, callable $callback = null): Relation
    {
        return $this->relation($name, $RelatedType, HasOne::class, $callback);
    }

    public function hasMany(string $name, string $RelatedType, callable $callback = null): Relation
    {
        return $this->relation($name, $RelatedType, HasMany::class, $callback);
    }

    public function linkOne(string $name, string $RelatedType, callable $callback = null): Relation
    {
        return $this->relation($name, $RelatedType, LinkOne::class, $callback);
    }

    public function linkMany(string $name, string $RelatedType, callable $callback = null): Relation
    {
        return $this->relation($name, $RelatedType, LinkMany::class, $callback);
    }

    public function relation(string $name, string $RelatedType, string $Relation, callable $callback = null): Relation
    {
        $this->container->add($Relation); // register relation class
        $relation = $this->container->create($Relation, function (Relation $relation) use ($name, $RelatedType, $callback) {
            $relation
                ->name($name)
                ->relatedType($RelatedType);

            if ($callback) {
                $callback($relation);
            }
            $this->relations[$name] = $relation;
        });
        return $relation;
    }

    public function toSchemaJson(): array
    {
        return array_map(function (Relation $relation) {
            return $relation->toSchemaJson();
        }, $this->relations);
    }
}
