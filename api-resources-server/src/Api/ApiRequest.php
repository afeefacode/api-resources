<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;

class ApiRequest implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected Api $api;

    protected string $resource;

    protected string $action;

    protected array $filters = [];

    protected RequestedFields $fields;

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
        $this->fields = $this->container->create(function (RequestedFields $requestedFields) use ($fields) {
            $TypeClass = $this->getAction()->getResponse()->getTypeClass();
            $requestedFields
                ->typeClass($TypeClass)
                ->fields($fields);
        });

        return $this;
    }

    public function getFields(): RequestedFields
    {
        return $this->fields;
    }

    public function dispatch()
    {
        return $this
            ->getAction()
            ->run();
    }
}
