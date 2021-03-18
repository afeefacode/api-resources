<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\DI\Container;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Resource\ResourceBag;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validator;

class Api implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected ResourceBag $resources;

    public static function create(Container $container = null): Api
    {
        return new static($container);
    }

    public function __construct(Container $container = null)
    {
        $this->container($container ?? new Container());

        $this->resources = $this->container->create(ResourceBag::class);
        $this->resources($this->resources);
    }

    public function resources(ResourceBag $resources): void
    {
    }

    public function getAction(string $resourceType, string $actionName): Action
    {
        $resource = $this->resources->get($resourceType);
        return $resource->getAction($actionName);
    }

    public function request()
    {
        $request = new Request();
        $request->api($this);
        return $request;
    }

    public function toSchemaJson(): array
    {
        $resources = $this->resources->toSchemaJson();

        $types = array_map(
            function (Type $type) {
                return $type->toSchemaJson();
            },
            array_filter(
                $this->container->entries(),
                function ($object) {
                    return $object instanceof Type;
                }
            )
        );

        $validators = array_map(function (Validator $validator) {
            return $validator->toSchemaJson();
        }, array_filter($this->container->entries(), function ($object) {
            return $object instanceof Validator;
        }));

        return [
            'types' => $types,
            'resources' => $resources,
            'validators' => $validators
            // 'fields' => $fields,
            // 'relations' => $relations,
        ];
    }
}
