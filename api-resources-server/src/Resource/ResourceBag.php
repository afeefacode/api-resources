<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackArgumentException;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeHintException;
use ReflectionFunction;

class ResourceBag implements ToSchemaJsonInterface
{
    /**
     * @var array<Resource>
     */
    public array $resources = [];

    public function resource($classOrCallback): ResourceBag
    {
        if (is_callable($classOrCallback)) {
            $callback = $classOrCallback;
            $f = new ReflectionFunction($callback);
            $param = $f->getParameters()[0] ?? null;
            if ($param) {
                /** @var ReflectionNamedType */
                $type = $param->getType();
                if ($type) {
                    $Resource = $type->getName();
                    $resource = new $Resource();
                    $callback($resource);
                    $this->resources[$resource->type] = $resource;
                } else {
                    throw new MissingTypeHintException("Resources callback variable \${$param->getName()} does provide a type hint.");
                }
            } else {
                throw new MissingCallbackArgumentException('Resources callback does not provide an argument.');
            }
        } else {
            $Resource = $classOrCallback;
            $resource = new $Resource();
            $this->resources[$resource->type] = $resource;
        }

        return $this;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        return array_map(function (Resource $resource) use ($visitor) {
            return $resource->toSchemaJson($visitor);
        }, $this->resources);
    }
}
