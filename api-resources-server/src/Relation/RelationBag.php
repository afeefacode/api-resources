<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Api\TypeRegistry;
use Afeefa\ApiResources\Bag\Bag;

/**
 * @method Relation get(string $name)
 * @method Relation[] entries()
 */
class RelationBag extends Bag
{
    public function add(string $name, string $RelatedType, $classOrCallback): RelationBag
    {
        $this->container->create($classOrCallback, function (Relation $relation) use ($name, $RelatedType) {
            $relation
                ->name($name)
                ->relatedType($RelatedType);
            $this->set($name, $relation);
        });

        return $this;
    }

    public function getEntrySchemaJson(Relation $relation, TypeRegistry $typeRegistry): ?array
    {
        $typeRegistry->registerRelation(get_class($relation));
        return $relation->toSchemaJson();
    }
}
