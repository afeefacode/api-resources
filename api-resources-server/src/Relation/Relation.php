<?php

namespace Afeefa\ApiResources\Relation;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;

class Relation implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    public string $type;

    public string $name;

    public string $RelatedType;

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
