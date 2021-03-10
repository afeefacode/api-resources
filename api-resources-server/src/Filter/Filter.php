<?php

namespace Afeefa\ApiResources\Filter;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;

class Filter implements ToSchemaJsonInterface
{
    public string $type;

    public string $name;

    public function __construct()
    {
        if (!isset($this->type)) {
            throw new MissingTypeException('Missing type for filter of class ' . static::class);
        };
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $json = [
            'type' => $this->type
        ];

        return $json;
    }
}
