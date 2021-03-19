<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Api\TypeRegistry;
use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\DI\Resolver;

/**
 * @method Relation get(string $name)
 * @method Relation[] entries()
 */
class RelationBag extends Bag
{
    public function add(string $name, string $RelatedType, $classOrCallback): RelationBag
    {
        $this->container->create($classOrCallback, function (Resolver $r) use ($name, $RelatedType) {
            $r->resolved(function ($instance) use ($name, $RelatedType) {
                if ($instance instanceof Relation) {
                    $instance
                        ->name($name)
                        ->relatedType($RelatedType);
                    $this->set($name, $instance);
                }
            });
        });

        return $this;
    }

    public function getEntrySchemaJson(Relation $relation, TypeRegistry $typeRegistry): ?array
    {
        $typeRegistry->registerRelation(get_class($relation));
        return $relation->toSchemaJson();
    }
}
