<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\DI\Injector;

/**
 * @method Relation get(string $name)
 * @method Relation[] entries()
 */
class RelationBag extends Bag
{
    public function add(string $name, string $RelatedType, $classOrCallback): RelationBag
    {
        [$Relation, $callback] = $this->classOrCallback($classOrCallback);

        $init = function (Relation $relation) use ($name, $RelatedType) {
            $relation
                ->name($name)
                ->relatedType($RelatedType);
            $this->set($name, $relation);
        };

        if ($Relation) {
            $this->container->create($Relation, null, $init);
        }

        if ($callback) {
            $this->container->call(
                $callback,
                function (Injector $i) {
                    $i->create = true;
                },
                $init
            );
        }

        return $this;
    }
}
