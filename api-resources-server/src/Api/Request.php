<?php

namespace Afeefa\ApiResources\Api;

class Request
{
    protected Api $api;

    protected string $resource;

    protected string $action;

    protected array $filters = [];

    public function resource(string $resource): Request
    {
        $this->resource = $resource;
        return $this;
    }

    public function api(Api $api): Request
    {
        $this->api = $api;
        return $this;
    }

    public function action(string $action): Request
    {
        $this->action = $action;
        return $this;
    }

    public function filter(string $name, string $value): Request
    {
        $this->filters[] = [$name => $value];
        return $this;
    }

    public function send()
    {
        return $this
            ->api
            ->getAction($this->resource, $this->action)
            ->call();
    }
}
