<?php

namespace Afeefa\ApiResources\Filter;

use Afeefa\ApiResources\Bag\Bag;

/**
 * @property Filter[] $entries
 */
class FilterBag extends Bag
{
    public function add(string $name, $classOrCallback): FilterBag
    {
        [$Filter, $callback] = $this->resolveCallback($classOrCallback);

        $this->container->create($Filter, function (Filter $filter) use ($name, $callback) {
            $filter->name($name);
            if ($callback) {
                $callback($filter);
            }
            $this->entries[$name] = $filter;
        });

        return $this;
    }
}
