<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;

class Relation extends BagEntry
{
    public string $type;

    protected string $name;

    protected string $RelatedType;

    public function created(): void
    {
        if (!isset($this->type)) {
            throw new MissingTypeException('Missing type for relation of class ' . static::class);
        };
    }

    public function name(string $name): Relation
    {
        $this->name = $name;
        return $this;
    }

    public function relatedType(string $RelatedType): Relation
    {
        $this->RelatedType = $RelatedType;
        $this->container->add($this->RelatedType);
        return $this;
    }

    public function toSchemaJson(): array
    {
        $relatedType = $this->container->get($this->RelatedType);

        return [
            'type' => $this->type,
            'related_type' => $relatedType->type
        ];
    }
}
