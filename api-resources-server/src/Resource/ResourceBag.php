<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;

class ResourceBag implements ToSchemaJsonInterface
{
    /**
     * @var array<Resource>
     */
    public array $resources = [];

    public function resource(string $name, callable $callback = null): ResourceBag
    {
        $resource = new Resource();
        $resource->name = $name;
        if ($callback) {
            $callback($resource);
        }
        $this->resources[$name] = $resource;
        return $this;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        return array_map(function (Resource $resource) use ($visitor) {
            return $resource->toSchemaJson($visitor);
        }, $this->resources);
    }
}
