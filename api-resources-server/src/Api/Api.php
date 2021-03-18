<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Resource\ResourceBag;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validator;
use Closure;

class Api implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected ResourceBag $resources;

    public function created(): void
    {
        $this->resources = $this->container->create(ResourceBag::class);
        $this->resources($this->resources);
    }

    public function getAction(string $resourceType, string $actionName): Action
    {
        $resource = $this->resources->get($resourceType);
        return $resource->getAction($actionName);
    }

    public function request(Closure $callback)
    {
        $request = new Request();
        $request->api($this);

        $callback($request);

        return $request->send();
    }

    public function requestFromInput()
    {
        $request = new Request();
        $request->api($this);
        $request->fromInput();

        return $request->send();
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

    protected function resources(ResourceBag $resources): void
    {
    }
}
