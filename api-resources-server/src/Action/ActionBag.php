<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;

class ActionBag implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * @var array<Action>
     */
    public array $actions = [];

    public function add(string $name, callable $callback = null): ActionBag
    {
        $this->container->create(Action::class, function (Action $action) use ($name, $callback) {
            $action->name = $name;
            if ($callback) {
                $callback($action);
            }
            $this->actions[$name] = $action;
        });
        return $this;
    }

    public function remove(string $name): ActionBag
    {
        unset($this->actions[$name]);
        return $this;
    }

    public function toSchemaJson(): array
    {
        return array_map(function (Action $action) {
            return $action->toSchemaJson();
        }, $this->actions);
    }
}
