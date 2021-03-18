<?php

namespace Afeefa\ApiResources\Api;

class ApiRequest
{
    protected Api $api;

    protected string $resource;

    protected string $action;

    protected array $filters = [];

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

    public function filter(string $name, string $value): ApiRequest
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
