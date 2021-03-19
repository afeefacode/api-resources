<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\DI\Injector;

/**
 * @method Resource get(string $name)
 * @method Resource[] entries()
 */
class ResourceBag extends Bag
{
    public function add($classOrCallback): ResourceBag
    {
        [$Resource, $callback] = $this->classOrCallback($classOrCallback);

        $init = function (Resource $resource) {
            $this->set($resource::$type, $resource);
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
