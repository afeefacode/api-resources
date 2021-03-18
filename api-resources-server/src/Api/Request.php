<?php

namespace Afeefa\ApiResources\Api;

use Closure;

class Request
{
    protected string $resource;

    protected $action;

    protected array $filters = [];

    public static function new()
    {
        return new self();
    }

    public function resource(string $resource): Request
    {
        $this->resource = $resource;
        return $this;
    }

    public function action(Closure $action): Request
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
