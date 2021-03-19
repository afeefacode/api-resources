<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\DI\Resolver;

/**
 * @method Resource get(string $name)
 * @method Resource[] entries()
 */
class ResourceBag extends Bag
{
    public function add($classOrCallback): ResourceBag
    {
        [$Resource, $callback] = $this->classOrCallback($classOrCallback);

        $resolve = function (Resolver $r) {
            $r
                ->create()
                ->resolved(function (Resource $resource) {
                    $this->set($resource::$type, $resource);
                });
        };

        if ($Resource) {
            $this->container->create($Resource, $resolve);
        }

        if ($callback) {
            $this->container->call($callback, $resolve);
        }

        return $this;
    }
}
