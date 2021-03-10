<?php

namespace Afeefa\ApiResources\Filter;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Filter\Filters\BooleanFilter;
use Afeefa\ApiResources\Filter\Filters\IdFilter;
use Afeefa\ApiResources\Filter\Filters\KeywordFilter;
use Afeefa\ApiResources\Filter\Filters\OrderFilter;
use Afeefa\ApiResources\Filter\Filters\PageFilter;
use Afeefa\ApiResources\Filter\Filters\TypeFilter;

class FilterBag implements ToSchemaJsonInterface
{
    /**
     * @var array<Filter>
     */
    public array $filters = [];

    public function id(string $name, callable $callback = null): IdFilter
    {
        return $this->filter($name, IdFilter::class, $callback);
    }

    public function boolean(string $name, callable $callback = null): BooleanFilter
    {
        return $this->filter($name, BooleanFilter::class, $callback);
    }

    public function keyword(string $name, callable $callback = null): Filter
    {
        return $this->filter($name, KeywordFilter::class, $callback);
    }

    public function type(string $name, callable $callback = null): Filter
    {
        return $this->filter($name, TypeFilter::class, $callback);
    }

    public function page(string $name, callable $callback = null): PageFilter
    {
        return $this->filter($name, PageFilter::class, $callback);
    }

    public function order(string $name, callable $callback = null): OrderFilter
    {
        return $this->filter($name, OrderFilter::class, $callback);
    }

    protected function filter(string $name, string $Filter, callable $callback = null): Filter
    {
        $filter = new $Filter();
        $filter->name = $name;
        if ($callback) {
            $callback($filter);
        }
        $this->filters[$name] = $filter;
        return $filter;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        return array_map(function (Filter $filter) use ($visitor) {
            return $filter->toSchemaJson($visitor);
        }, $this->filters);
    }
}
