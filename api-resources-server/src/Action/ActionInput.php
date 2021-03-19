<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Api\TypeRegistry;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;

class ActionInput implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected bool $list = false;

    protected string $Type;

    public function type(string $Type)
    {
        $this->Type = $Type;

        return $this;
    }

    public function list()
    {
        $this->list = true;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $this->container->get(function (TypeRegistry $typeRegistry) {
            $typeRegistry->registerType($this->Type);
        });

        $json = [
            'type' => $this->Type::$type
        ];

        return $json;
    }
}
