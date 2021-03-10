<?php

namespace Afeefa\ApiResources\Api;

class Request
{
    public string $resource;
    public $action;
    public array $filters = [];

    public static function new()
    {
        return new self();
    }

    public function resource(string $resource): Request
    {
        $this->resource = $resource;
        return $this;
    }

    public function action(callable $action): Request
    {
        $this->action = $action;
        return $this;
    }

    public function filter(string $name, string $value): Request
    {
        $this->filters[] = [$name => $value];
        return $this;
    }
}
