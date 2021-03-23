<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Resource\ResourceBag;
use Closure;

class Api implements ContainerAwareInterface
{
    use ContainerAwareTrait;
    use ToSchemaJsonTrait;

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
        $request = $this->container->get(ApiRequest::class);
        $request->api($this);
        $callback($request);
        return $request->dispatch();
    }

    public function requestFromInput()
    {
        $request = $this->container->get(ApiRequest::class);
        $request->api($this);
        $request->fromInput();
        return $request->dispatch();
    }

    public function getSchemaJson(TypeRegistry $typeRegistry): array
    {
        $resources = $this->resources->toSchemaJson();

        // $typeRegistry->dumpEntries();
        // $this->container->dumpEntries();

        $types = [];
        foreach ($typeRegistry->types() as $Type) {
            $type = $this->container->get($Type);
            $types[$type::$type] = $type->toSchemaJson();
        }

        $validators = [];
        foreach ($typeRegistry->validators() as $Validator) {
            $validator = $this->container->get($Validator);
            $validators[$validator::$type] = $validator->toSchemaJson();
        }

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
