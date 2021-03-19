<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Bag\Bag;
use Closure;

/**
 * @method Action get(string $name)
 * @method Action[] entries()
 */
class ActionBag extends Bag
{
    public function add(string $name, Closure $callback): ActionBag
    {
        $this->container->create(function (Action $action) use ($name, $callback) {
            $action->name($name);
            $callback($action);
            $this->set($name, $action);
        });
        return $this;
    }
}
