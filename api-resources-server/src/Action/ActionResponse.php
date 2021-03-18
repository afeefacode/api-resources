<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;

class ActionResponse implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected bool $list = false;

    protected string $type;

    protected array $types;

    public function type(string $Type)
    {
        $this->type = $Type;

        $this->container->add($this->type);

        return $this;
    }

    public function types(array $types)
    {
        $this->types = $types;
        return $this;
    }

    public function list()
    {
        $this->list = true;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $type = $this->container->get($this->type);

        $json = [
            'type' => $type->type
        ];

        return $json;
    }
}
