<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\Bag\BagEntryInterface;
use Closure;

/**
 * @method Action get(string $name)
 * @method Action[] getEntries()
 */
class ActionBag extends Bag
{
    public function query(string $name, Closure $callback): ActionBag
    {
        $this->setDefinition($name, $callback, function (Action $action) use ($name) {
            $action->name($name);
        });

        return $this;
    }

    public function mutation(string $name, Closure $callback): ActionBag
    {
        $this->setDefinition($name, $callback, function (Action $action) use ($name) {
            $action
                ->name($name)
                ->isMutation();
        });

        return $this;
    }

    /**
     * disabled
     */
    public function set(string $name, BagEntryInterface $value): Bag
    {
        return $this;
    }
}
