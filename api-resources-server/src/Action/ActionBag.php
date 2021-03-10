<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;

class ActionBag implements ToSchemaJsonInterface
{
    /**
     * @var array<Action>
     */
    public array $actions = [];

    public function action(string $name, callable $callback = null): ActionBag
    {
        $action = new Action();
        $action->name = $name;
        if ($callback) {
            $callback($action);
        }
        $this->actions[$name] = $action;
        return $this;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        return array_map(function (Action $action) use ($visitor) {
            return $action->toSchemaJson($visitor);
        }, $this->actions);
    }
}
