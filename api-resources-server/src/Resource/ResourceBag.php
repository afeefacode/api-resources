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
        $this->container->create($classOrCallback, function (Resolver $r) {
            $r->resolved(function (Resource $resource) {
                $this->set($resource::$type, $resource);
            });
        });

        return $this;
    }
}
