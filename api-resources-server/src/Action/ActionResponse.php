<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;

class ActionResponse implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected bool $list = false;

    protected string $Type;

    protected array $Types;

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
        $json = [
            'type' => $this->Type::$type
        ];

        return $json;
    }
}
