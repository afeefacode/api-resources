<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;

class ResourceBag implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * @var array<Resource>
     */
    public array $resources = [];

    public function resource($classOrCallback): ResourceBag
    {
        if (is_callable($classOrCallback)) {
            $callback = $classOrCallback;
            $Resource = $this->container->getCallbackArgumentType($callback);
            $this->container->create($Resource, function (Resource $resource) use ($callback) {
                $callback($resource);
                $this->resources[$resource->type] = $resource;
            });
        } else {
            $Resource = $classOrCallback;
            $this->container->create($Resource, function (Resource $resource) {
                $this->resources[$resource->type] = $resource;
            });
        }

        return $this;
    }

    public function toSchemaJson(): array
    {
        return array_map(function (Resource $resource) {
            return $resource->toSchemaJson();
        }, $this->resources);
    }
}
