<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Filter\FilterBag;

class Action implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    public string $name;

    public ActionParams $params;

    public ActionInput $input;

    public FilterBag $filters;

    public ActionResponse $response;

    public function params(callable $callback): Action
    {
        $this->container->create(ActionParams::class, function (ActionParams $params) use ($callback) {
            $callback($params);
            $this->params = $params;
        });
        return $this;
    }

    public function input(callable $callback): Action
    {
        $this->container->create(ActionInput::class, function (ActionInput $input) use ($callback) {
            $callback($input);
            $this->input = $input;
        });
        return $this;
    }

    public function filters(callable $callback): Action
    {
        $this->container->create(FilterBag::class, function (FilterBag $filters) use ($callback) {
            $callback($filters);
            $this->filters = $filters;
        });
        return $this;
    }

    public function response(callable $callback): Action
    {
        $this->container->create(ActionResponse::class, function (ActionResponse $response) use ($callback) {
            $callback($response);
            $this->response = $response;
        });
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = [
            // 'name' => $this->name
        ];

        if (isset($this->params)) {
            $json['params'] = $this->params->toSchemaJson();
        }

        if (isset($this->input)) {
            $json['input'] = $this->input->toSchemaJson();
        }

        if (isset($this->filters)) {
            $json['filters'] = $this->filters->toSchemaJson();
        }

        if (isset($this->response)) {
            $json['response'] = $this->response->toSchemaJson();
        }

        return $json;
    }
}
