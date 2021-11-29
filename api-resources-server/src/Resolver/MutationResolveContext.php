<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Api\FieldsToSave;
use Afeefa\ApiResources\Api\Operation;
use Afeefa\ApiResources\DB\TypeClassMap;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\DI\DependencyResolver;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Type\Type;

class MutationResolveContext implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected FieldsToSave $fieldsToSave;

    /**
     * @var MutationRelationResolver[]
     */
    protected array $relationResolvers;

    public function fieldsToSave(FieldsToSave $fieldsToSave): MutationResolveContext
    {
        $this->fieldsToSave = $fieldsToSave;
        return $this;
    }

    /**
     * @return MutationRelationResolver[]
     */
    public function getSaveRelationResolvers(): array
    {
        if (!isset($this->saveRelationResolvers)) {
            $this->createSaveRelationResolvers();
        }

        return $this->saveRelationResolvers;
    }

    public function getSaveFields(): array
    {
        if (!isset($this->saveRelationResolvers)) {
            $this->createSaveRelationResolvers();
        }

        return $this->calculateSaveFields($this->fieldsToSave);
    }

    /**
     * @return MutationRelationResolver[]
     */
    protected function createSaveRelationResolvers()
    {
        $fieldsToSave = $this->fieldsToSave;
        $type = $fieldsToSave->getType();
        $operation = $fieldsToSave->getOperation();

        $saveRelationResolvers = [];
        foreach ($fieldsToSave->getFieldNames() as $fieldName) {
            if ($this->hasSaveRelation($type, $operation, $fieldName)) {
                $relation = $this->getSaveRelation($type, $operation, $fieldName);
                $resolveCallback = $relation->getSaveResolve();

                /** @var MutationRelationResolver */
                $saveRelationResolver = null;

                if ($resolveCallback) {
                    $this->container->call(
                        $resolveCallback,
                        function (DependencyResolver $r) {
                            if ($r->isOf(MutationRelationResolver::class)) {
                                $r->create();
                            }
                        },
                        function () use (&$saveRelationResolver) {
                            $arguments = func_get_args();
                            foreach ($arguments as $argument) {
                                if ($argument instanceof MutationRelationResolver) {
                                    $saveRelationResolver = $argument;
                                }
                            }
                        }
                    );

                    if (!$saveRelationResolver) {
                        throw new InvalidConfigurationException("Resolve callback for save relation {$fieldName} on type {$type::type()} must receive a MutationRelationResolver as argument.");
                    }

                    $saveRelationResolver->ownerType($type);
                    $saveRelationResolver->relation($relation);
                    $saveRelationResolver->fieldsToSave($fieldsToSave->getNestedField($fieldName));
                    $saveRelationResolvers[$fieldName] = $saveRelationResolver;
                } else {
                    throw new InvalidConfigurationException("Relation {$fieldName} on type {$type::type()} does not have a save relation resolver.");
                }
            }
        }

        $this->saveRelationResolvers = $saveRelationResolvers;
    }

    protected function calculateSaveFields(FieldsToSave $fieldsToSave): array
    {
        $type = $fieldsToSave->getType();
        $saveRelationResolvers = $this->saveRelationResolvers;

        $saveFields = [];

        foreach ($fieldsToSave->getFields() as $fieldName => $value) {
            // value is a scalar
            if ($this->hasSaveAttribute($type, $fieldsToSave->getOperation(), $fieldName)) {
                $attribute = $type->getAttribute($fieldName);
                if (!$attribute->hasResolver()) { // let resolvers provide value
                    $saveFields[$fieldName] = $value;
                }
            }

            // value is a FieldsToSave or null
            if ($this->hasSaveRelation($type, $fieldsToSave->getOperation(), $fieldName)) {
                $relation = $this->getSaveRelation($type, $fieldsToSave->getOperation(), $fieldName);

                $saveRelationResolver = $saveRelationResolvers[$fieldName];
                $ownerIdFields = $saveRelationResolver->getOwnerIdFields();
                foreach ($ownerIdFields as $ownerIdField) {
                    if ($relation->isSingle() && !$value) {
                        $saveFields[$ownerIdField] = null;
                    } else {
                        // TODO set type field as id field if necessary
                        $saveFields[$ownerIdField] = $value->getId();
                    }
                }
            }
        }

        return $saveFields;
    }

    protected function getTypeByName(string $typeName): Type
    {
        return $this->container->call(function (TypeClassMap $typeClassMap) use ($typeName) {
            $TypeClass = $typeClassMap->get($typeName) ?? Type::class;
            return $this->container->get($TypeClass);
        });
    }

    protected function hasSaveAttribute(Type $type, string $operation, string $name): bool
    {
        $method = $operation === Operation::UPDATE ? 'Update' : 'Create';
        return $type->{'has' . $method . 'Attribute'}($name);
    }

    protected function hasSaveRelation(Type $type, string $operation, string $name): bool
    {
        $method = $operation === Operation::UPDATE ? 'Update' : 'Create';
        return $type->{'has' . $method . 'Relation'}($name);
    }

    protected function getSaveRelation(Type $type, string $operation, string $name): Relation
    {
        $method = $operation === Operation::UPDATE ? 'Update' : 'Create';
        return $type->{'get' . $method . 'Relation'}($name);
    }
}
