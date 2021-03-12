<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;

class Relation implements ToSchemaJsonInterface
{
    public string $type;

    public string $name;

    public string $RelatedType;

    public function __construct()
    {
        if (!isset($this->type)) {
            throw new MissingTypeException('Missing type for relation of class ' . static::class);
        };
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $visitor->relation($this);

        $RelatedType = $this->RelatedType;
        $relatedType = new $RelatedType();

        $visitor->type($relatedType);

        return [
            'type' => $this->type,
            'related_type' => $relatedType->type
        ];
    }
}
