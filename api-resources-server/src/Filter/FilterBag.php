<?php

namespace Afeefa\ApiResources\Filter;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\DI\Resolver;

/**
 * @method Filter get(string $name)
 * @method Filter[] entries()
 */
class FilterBag extends Bag
{
    public function add(string $name, $classOrCallback): FilterBag
    {
        [$Filter, $callback] = $this->classOrCallback($classOrCallback);

        $resolve = function (Resolver $r) use ($name) {
            $r
                ->create()
                ->resolved(function (Filter $filter) use ($name) {
                    $filter->name($name);
                    $this->set($name, $filter);
                });
        };

        if ($Filter) {
            $this->container->create($Filter, $resolve);
        }

        if ($callback) {
            $this->container->call($callback, $resolve);
        }

        return $this;
    }
}
