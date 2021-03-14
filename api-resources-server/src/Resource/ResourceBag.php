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
        if (is_callable($classOrCallback)) {
            $callback = $classOrCallback;
            $Resource = $this->container->getCallbackArgumentType($callback);
            $this->container->create($Resource, function (Resource $resource) use ($callback) {
                $callback($resource);
                $this->entries[$resource->type] = $resource;
            });
        } else {
            $Resource = $classOrCallback;
            $this->container->create($Resource, function (Resource $resource) {
                $this->entries[$resource->type] = $resource;
            });
        }

        return $this;
    }
}
