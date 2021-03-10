<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;

class ActionInput implements ToSchemaJsonInterface
{
    public bool $list = false;
    public string $Type;

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

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $Type = $this->Type;
        $type = new $Type();

        $visitor->model($type);

        $json = [
            'type' => $type->type
        ];

        return $json;
    }
}
