<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;

class Resource extends BagEntry
{
    public string $type;

    protected ActionBag $actions;

    public function created(): void
    {
        if (!isset($this->type)) {
            throw new MissingTypeException('Missing type for resource of class ' . static::class);
        };

        $this->actions = $this->container->create(ActionBag::class);
        $this->actions($this->actions);
    }

    public function actions(ActionBag $actions): void
    {
    }

    public function removeAction(string $name): Resource
    {
        $this->actions->remove($name);
        return $this;
    }

    public function toSchemaJson(): array
    {
        return $this->actions->toSchemaJson();

        $json = [
            // 'type' => $this->type,
            'actions' => $this->actions->toSchemaJson()
        ];

        return $json;
    }
}
