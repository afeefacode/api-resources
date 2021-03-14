<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Bag\Bag;

/**
 * @property Resource[] $entries
 */
class ResourceBag extends Bag
{
    public function add($classOrCallback): ResourceBag
    {
        [$Resource, $callback] = $this->resolveCallback($classOrCallback);

        $this->container->create($Resource, function (Resource $resource) use ($callback) {
            if ($callback) {
                $callback($resource);
            }
            $this->entries[$resource->type] = $resource;
        });

        return $this;
    }
}
