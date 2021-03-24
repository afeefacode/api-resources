<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Type\Type;

class ApiRequest implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected Api $api;

    protected string $resource;

    protected string $action;

    protected array $filters = [];

    protected array $fields = [];

    public function fromInput(): ApiRequest
    {
        $input = json_decode(file_get_contents('php://input'), false);

        $this->resource = $input->resource;
        $this->action = $input->action;

        return $this;
    }

    public function resource(string $resource): ApiRequest
    {
        $this->resource = $resource;
        return $this;
    }

    public function api(Api $api): ApiRequest
    {
        $this->api = $api;
        return $this;
    }

    public function action(string $action): ApiRequest
    {
        $this->action = $action;
        return $this;
    }

    public function getAction(): Action
    {
        return $this->api->getAction($this->resource, $this->action);
    }

    public function filter(string $name, string $value): ApiRequest
    {
        $this->filters[] = [$name => $value];
        return $this;
    }

    public function fields(array $fields): ApiRequest
    {
        $Type = $this->getAction()->getResponse()->getType();
        $type = $this->container->get($Type);

        $this->fields = $this->normalizeFields($type, $fields);

        return $this;
    }

    public function getFields(): array
    {
        return $this->fields;
    }

    public function dispatch()
    {
        return $this
            ->getAction()
            ->run();
    }

    protected function normalizeFields(Type $type, array $requestedFields): array
    {
        $normalizedFields = [];
        foreach ($requestedFields as $requestedField => $nested) {
            if ($type->hasAttribute($requestedField)) {
                $normalizedFields[$requestedField] = true;
            }

            if ($type->hasRelation($requestedField)) {
                if ($nested === true) {
                    $nested = [];
                }
                if (is_array($nested)) {
                    $relatedType = $type->getRelation($requestedField)->getRelatedTypeInstance();
                    $normalizedFields[$requestedField] = $this->normalizeFields($relatedType, $nested);
                }
            }

            if (preg_match('/^\@/', $requestedField)) {
                // $normalizedFields[$requestedField] = $nested;
            }
        }

        return $normalizedFields;
    }
}
