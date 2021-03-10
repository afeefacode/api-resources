<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;

class Resource implements ToSchemaJsonInterface
{
    public string $type;

    protected ActionBag $actions;

    public function __construct()
    {
        if (!isset($this->type)) {
            throw new MissingTypeException('Missing type for resource of class ' . static::class);
        };

        $actions = new ActionBag();
        $this->actions($actions);
        $this->actions = $actions;
    }

    public function actions(ActionBag $actions): void
    {
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        return $this->actions->toSchemaJson($visitor);

        $json = [
            // 'type' => $this->type,
            'actions' => $this->actions->toSchemaJson($visitor)
        ];

        return $json;
    }
}
