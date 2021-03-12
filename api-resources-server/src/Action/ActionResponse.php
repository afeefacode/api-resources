<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;

class ActionResponse implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    public bool $list = false;
    public string $Type;
    public string $Types;

    public function type(string $Type)
    {
        $this->Type = $Type;

        $this->container->add($this->Type);

        return $this;
    }

    public function types(array $Types)
    {
        $this->Types = $Types;
        return $this;
    }

    public function list()
    {
        $this->list = true;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $type = $this->container->get($this->Type);

        $json = [
            'type' => $type->type
        ];

        return $json;
    }
}
