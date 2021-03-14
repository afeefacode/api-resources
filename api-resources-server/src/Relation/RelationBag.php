<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Bag\Bag;

/**
 * @property Relation[] $entries
 */
class RelationBag extends Bag
{
    public function add(string $name, string $RelatedType, $classOrCallback = null): RelationBag
    {
        if (is_callable($classOrCallback)) {
            $callback = $classOrCallback;
            $Relation = $this->container->getCallbackArgumentType($callback);
            $this->container->create($Relation, function (Relation $relation) use ($name, $RelatedType, $callback) {
                $relation->name = $name;
                $relation->RelatedType = $RelatedType;
                $callback($relation);
                $this->entries[$name] = $relation;
            });
        } else {
            $Relation = $classOrCallback;
            $this->container->create($Relation, function (Relation $relation) use ($name, $RelatedType) {
                $relation->name = $name;
                $relation->RelatedType = $RelatedType;
                $this->entries[$name] = $relation;
            });
        }

        return $this;
    }
}
