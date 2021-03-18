<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\DI\Injector;

/**
 * @property Resource[] $entries
 * @method Resource get(string $type)
 */
class ResourceBag extends Bag
{
    public function add($classOrCallback): ResourceBag
    {
        [$Resource, $callback] = $this->classOrCallback($classOrCallback);

        $init = function (Resource $resource) {
            $this->entries[$resource::$type] = $resource;
        };

        if ($Resource) {
            $this->container->create($Resource, null, $init);
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
