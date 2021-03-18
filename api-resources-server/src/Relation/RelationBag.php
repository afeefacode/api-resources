<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Bag\Bag;

/**
 * @property Relation[] $entries
 */
class RelationBag extends Bag
{
    public function add(string $name, string $RelatedType, $classOrCallback): RelationBag
    {
        [$Relation, $callback] = $this->resolveCallback($classOrCallback);

        $this->container->create($Relation, function (Relation $relation) use ($name, $RelatedType, $callback) {
            $relation
                ->name($name)
                ->relatedType($RelatedType);
            if ($callback) {
                $callback($relation);
            }
            $this->entries[$name] = $relation;
        });

        return $this;
    }
}
