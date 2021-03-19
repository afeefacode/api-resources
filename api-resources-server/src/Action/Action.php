<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\DI\Resolver;
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
        $this->container->create($callback, function (ActionParams $params) {
            $this->params = $params;
        });
        return $this;
    }

    public function input(Closure $callback): Action
    {
        $this->container->create($callback, function (ActionInput $input) {
            $this->input = $input;
        });
        return $this;
    }

    public function filters(Closure $callback): Action
    {
        $this->container->create($callback, function (FilterBag $filters) {
            $this->filters = $filters;
        });
        return $this;
    }

    public function response(Closure $callback): Action
    {
        $this->container->create($callback, function (ActionResponse $response) {
            $this->response = $response;
        });
        return $this;
    }

    public function execute(Closure $callback): Action
    {
        $this->executor = $callback;
        return $this;
    }

    public function call(ApiRequest $request)
    {
        return $this->container->call(
            $this->executor,
            function (Resolver $r) use ($request) {
                if ($r->isOf(ApiRequest::class)) {
                    $r->fix($request);
                }
            }
        );
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
