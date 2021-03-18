<?php

namespace Afeefa\ApiResources\Type;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Relation\RelationBag;

class Type implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    public static string $type = 'Afeefa.Type';

    protected FieldBag $fields;

    protected RelationBag $relations;

    public function created(): void
    {
        $this->fields = $this->container->create(FieldBag::class);
        $this->fields($this->fields);

        $this->relations = $this->container->create(RelationBag::class);
        $this->relations($this->relations);
    }

    public function toSchemaJson(): array
    {
        return [
            // 'type' => static::$type,
            'fields' => $this->fields->toSchemaJson(),
            'relations' => $this->relations->toSchemaJson()
        ];
    }

    protected function fields(FieldBag $fields): void
    {
    }

    protected function relations(RelationBag $relations): void
    {
    }
}
