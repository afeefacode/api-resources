<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Type\Type;

class TypeRegistry implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected array $validators = [];

    protected array $fields = [];

    protected array $relations = [];

    protected array $types = [];

    protected array $resources = [];

    public function registerValidator(string $Validator)
    {
        $this->validators[$Validator] = $Validator;
    }

    public function validators()
    {
        return $this->validators;
    }

    public function registerField(string $Field)
    {
        $this->fields[$Field] = $Field;
    }

    public function registerRelation(string $Relation)
    {
        $this->relations[$Relation] = $Relation;
    }

    public function registerType(string $Type)
    {
        if (!isset($this->types[$Type])) {
            $this->container->get($Type, function (Type $type) use ($Type) {
                $this->types[$Type] = $Type;
                $type->toSchemaJson();
            });
        }
    }

    public function types()
    {
        return $this->types;
    }

    public function registerResource(string $Resource)
    {
        $this->resources[$Resource] = $Resource;
    }

    public function dumpEntries()
    {
        debug_dump([
            'types' => $this->types,
            'fields' => $this->fields,
            'validators' => $this->validators,
            'relations' => $this->relations,
        ]);
    }
}
