<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Api\RequestParams;
use Afeefa\ApiResources\Api\TypeRegistry;
use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;
use Afeefa\ApiResources\Type\Type;

class Relation extends BagEntry
{
    public static string $type;

    protected string $name;

    protected string $RelatedType;

    protected RequestParams $params;

    public function created(): void
    {
        if (!static::$type) {
            throw new MissingTypeException('Missing type for relation of class ' . static::class . '.');
        };

        $this->params = new RequestParams();
    }

    public function name(string $name): Relation
    {
        $this->name = $name;
        return $this;
    }

    public function params(): RequestParams
    {
        return $this->params;
    }

    public function relatedType(string $RelatedType): Relation
    {
        $this->RelatedType = $RelatedType;

        return $this;
    }

    public function getRelatedTypeInstance(): Type
    {
        return $this->container->get($this->RelatedType);
    }

    public function getSchemaJson(TypeRegistry $typeRegistry): array
    {
        $typeRegistry->registerType($this->RelatedType);
        return [
            'type' => static::$type,
            'related_type' => $this->RelatedType::$type
        ];
    }
}
