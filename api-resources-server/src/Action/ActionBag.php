<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Bag\Bag;

/**
 * @property Action[] $entries
 */
class ActionBag extends Bag
{
    public function add(string $name, callable $callback): ActionBag
    {
        $this->container->create(Action::class, function (Action $action) use ($name, $callback) {
            $action->name = $name;
            $callback($action);
            $this->entries[$name] = $action;
        });
        return $this;
    }
}
