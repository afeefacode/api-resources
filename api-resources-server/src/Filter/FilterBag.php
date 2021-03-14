<?php

namespace Afeefa\ApiResources\Filter;

use Afeefa\ApiResources\Bag\Bag;

/**
 * @property Filter[] $entries
 */
class FilterBag extends Bag
{
    public function add(string $name, $classOrCallback = null): FilterBag
    {
        if (is_callable($classOrCallback)) {
            $callback = $classOrCallback;
            $Filter = $this->container->getCallbackArgumentType($callback);
            $this->container->create($Filter, function (Filter $filter) use ($name, $callback) {
                $filter->name = $name;
                $callback($filter);
                $this->entries[$name] = $filter;
            });
        } else {
            $Filter = $classOrCallback;
            $this->container->create($Filter, function (Filter $filter) use ($name) {
                $filter->name = $name;
                $this->entries[$name] = $filter;
            });
        }

        return $this;
    }
}
