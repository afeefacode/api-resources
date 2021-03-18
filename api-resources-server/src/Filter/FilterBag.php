<?php

namespace Afeefa\ApiResources\Filter;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\DI\Injector;

/**
 * @property Filter[] $entries
 */
class FilterBag extends Bag
{
    public function add(string $name, $classOrCallback): FilterBag
    {
        [$Filter, $callback] = $this->classOrCallback($classOrCallback);

        $init = function (Filter $filter) use ($name) {
            $filter->name($name);
            $this->entries[$name] = $filter;
        };

        if ($Filter) {
            $this->container->create($Filter, null, $init);
        }

        if ($callback) {
            $this->container->call(
                $callback,
                function (Injector $i) {
                    $i->create = true;
                },
                $init
            );
        }

        return $this;
    }
}
