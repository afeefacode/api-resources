<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Bag\Bag;

/**
 * @property Resource[] $entries
 * @method Resource get(string $type)
 */
class ResourceBag extends Bag
{
    public function add($classOrCallback): ResourceBag
    {
        [$Resource, $callback] = $this->resolveCallback($classOrCallback);

        $this->container->create($Resource, function (Resource $resource) use ($Resource, $callback) {
            if ($callback) {
                $callback($resource);
            }
            $this->entries[$Resource::$type] = $resource;
        });

        return $this;
    }
}
