<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\Filter\FilterBag;
use Closure;

class Action extends BagEntry
{
    protected string $name;

    protected ActionParams $params;

    protected ActionInput $input;

    protected FilterBag $filters;

    protected ActionResponse $response;

    protected Closure $executor;

    public function name(string $name): Action
    {
        $this->name = $name;
        return $this;
    }

    public function params(Closure $callback): Action
    {
        $this->container->create(ActionParams::class, function (ActionParams $params) use ($callback) {
            $callback($params);
            $this->params = $params;
        });
        return $this;
    }

    public function input(Closure $callback): Action
    {
        $this->container->create(ActionInput::class, function (ActionInput $input) use ($callback) {
            $callback($input);
            $this->input = $input;
        });
        return $this;
    }

    public function filters(Closure $callback): Action
    {
        $this->container->create(FilterBag::class, function (FilterBag $filters) use ($callback) {
            $callback($filters);
            $this->filters = $filters;
        });
        return $this;
    }

    public function response(Closure $callback): Action
    {
        $this->container->create(ActionResponse::class, function (ActionResponse $response) use ($callback) {
            $callback($response);
            $this->response = $response;
        });
        return $this;
    }

    public function execute(Closure $callback): Action
    {
        $this->executor = $callback;
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
