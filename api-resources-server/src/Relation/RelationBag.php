<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Relation\Relations\HasMany;
use Afeefa\ApiResources\Relation\Relations\HasOne;
use Afeefa\ApiResources\Relation\Relations\LinkMany;
use Afeefa\ApiResources\Relation\Relations\LinkOne;

class RelationBag implements ToSchemaJsonInterface
{
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
        $relation = new $Relation();
        $relation->name = $name;
        $relation->RelatedType = $RelatedType;
        if ($callback) {
            $callback($relation);
        }
        $this->relations[$name] = $relation;
        return $relation;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        return array_map(function (Relation $relation) use ($visitor) {
            return $relation->toSchemaJson($visitor);
        }, $this->relations);
    }
}
