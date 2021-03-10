<?php

namespace Afeefa\ApiResources\Validator;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;

class Validator implements ToSchemaJsonInterface
{
    public string $type;

    public bool $required = false;

    public function __construct()
    {
        if (!isset($this->type)) {
            throw new MissingTypeException('Missing type for validator of class ' . static::class);
        };
    }

    public function required(): Validator
    {
        $this->required = true;
        return $this;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        return [
            'type' => $this->type
        ];
    }
}
