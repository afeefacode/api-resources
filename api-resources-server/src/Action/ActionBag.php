<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Bag\Bag;
use Closure;

/**
 * @property Action[] $entries
 * @method Action get(string $name)
 */
class ActionBag extends Bag
{
    public function add(string $name, Closure $callback): ActionBag
    {
        $this->container->create(Action::class, function (Action $action) use ($name, $callback) {
            $action->name($name);
            $callback($action);
            $this->entries[$name] = $action;
        });
        return $this;
    }
}
