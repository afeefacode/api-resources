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
        [$Relation, $callback] = $this->classOrCallback($classOrCallback);

        $resolve = function (Resolver $r) use ($name, $RelatedType) {
            $r
                ->create()
                ->resolved(function ($instance) use ($name, $RelatedType) {
                    if ($instance instanceof Relation) {
                        $instance
                            ->name($name)
                            ->relatedType($RelatedType);
                        $this->set($name, $instance);

                        $this->container->get(function (TypeRegistry $typeRegistry) use ($instance) {
                            $typeRegistry->registerRelation(get_class($instance));
                        });
                    }
                });
        };

        if ($Relation) {
            $this->container->create($Relation, $resolve);
        }

        if ($callback) {
            $this->container->call($callback, $resolve);
        }

        return $this;
    }
}
