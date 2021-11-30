<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Api\RequestedFields;
use Afeefa\ApiResources\DB\TypeClassMap;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\DI\DependencyResolver;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Type\Type;

class QueryResolveContext implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected RequestedFields $requestedFields;

    /**
     * @var QueryAttributeResolver[]
     */
    protected array $attributeResolvers;

    /**
     * @var QueryRelationResolver[]
     */
    protected array $relationResolvers;

    public function requestedFields(RequestedFields $requestedFields): QueryResolveContext
    {
        $this->requestedFields = $requestedFields;
        return $this;
    }

    /**
     * @return QueryAttributeResolver[]
     */
    public function getAttributeResolvers(): array
    {
        if (!isset($this->attributeResolvers)) {
            $this->createAttributeResolvers();
        }

        return $this->attributeResolvers;
    }

    /**
     * @return QueryRelationResolver[]
     */
    public function getRelationResolvers(): array
    {
        if (!isset($this->relationResolvers)) {
            $this->createRelationResolvers();
        }

        return $this->relationResolvers;
    }

    public function getSelectFields(string $typeName): array
    {
        if (!isset($this->attributeResolvers)) {
            $this->createAttributeResolvers();
        }

        if (!isset($this->relationResolvers)) {
            $this->createRelationResolvers();
        }

        $type = $this->getTypeByName($typeName);
        $requestedFields = $this->requestedFields;
        return $this->calculateSelectFields($type, $requestedFields);
    }

    protected function createAttributeResolvers()
    {
        $requestedFields = $this->requestedFields;
        $type = $requestedFields->getType();

        $attributeResolvers = [];
        foreach ($requestedFields->getFieldNames() as $fieldName) {
            if ($type->hasAttribute($fieldName)) {
                $attribute = $type->getAttribute($fieldName);
                if ($attribute->hasResolver()) {
                    $resolveCallback = $attribute->getResolve();
                    /** @var QueryAttributeResolver */
                    $attributeResolver = null;

                    $this->container->call(
                        $resolveCallback,
                        function (DependencyResolver $r) {
                            if ($r->isOf(QueryAttributeResolver::class)) { // QueryAttributeResolver
                                $r->create();
                            }
                        },
                        function () use (&$attributeResolver) {
                            $arguments = func_get_args();
                            foreach ($arguments as $argument) {
                                if ($argument instanceof QueryAttributeResolver) {
                                    $attributeResolver = $argument;
                                }
                            }
                        }
                    );

                    if (!$attributeResolver) {
                        throw new InvalidConfigurationException("Resolve callback for attribute {$fieldName} on type {$type::type()} must receive a AttributeResolver as argument.");
                    }

                    $attributeResolver->attribute($attribute);
                    $attributeResolvers[$fieldName] = $attributeResolver;
                }
            }
        }

        $this->attributeResolvers = $attributeResolvers;
    }

    protected function createRelationResolvers()
    {
        $requestedFields = $this->requestedFields;
        $type = $requestedFields->getType();

        $relationResolvers = [];
        foreach ($requestedFields->getFieldNames() as $fieldName) {
            if ($type->hasRelation($fieldName)) {
                $relation = $type->getRelation($fieldName);
                $resolveCallback = $relation->getResolve();

                /** @var QueryRelationResolver */
                $relationResolver = null;

                if ($resolveCallback) {
                    $this->container->call(
                        $resolveCallback,
                        function (DependencyResolver $r) {
                            if ($r->isOf(QueryRelationResolver::class)) { // QueryRelationResolver
                                $r->create();
                            }
                        },
                        function () use (&$relationResolver) {
                            $arguments = func_get_args();
                            foreach ($arguments as $argument) {
                                if ($argument instanceof QueryRelationResolver) {
                                    $relationResolver = $argument;
                                }
                            }
                        }
                    );

                    if (!$relationResolver) {
                        throw new InvalidConfigurationException("Resolve callback for relation {$fieldName} on type {$type::type()} must receive a RelationResolver as argument.");
                    }

                    $relationResolver
                        ->relation($relation)
                        ->requestedFields($requestedFields->getNestedField($fieldName));
                    $relationResolvers[$fieldName] = $relationResolver;
                } else {
                    throw new InvalidConfigurationException("Relation {$fieldName} on type {$type::type()} does not have a relation resolver.");
                }
            }
        }

        $this->relationResolvers = $relationResolvers;
    }

    protected function calculateSelectFields(Type $type, RequestedFields $requestedFields): array
    {
        $attributeResolvers = $this->attributeResolvers;
        $relationResolvers = $this->relationResolvers;

        $selectFields = ['id']; // TODO this might be a problem if using no 'id' tables

        foreach ($requestedFields->getFieldNames() as $fieldName) {
            // select attributes
            if ($type->hasAttribute($fieldName)) {
                $attribute = $type->getAttribute($fieldName);

                if ($attribute->hasResolver()) { // if a resolver
                    $attributeResolver = $attributeResolvers[$fieldName];
                    $attributeSelectFields = $attributeResolver->getSelectFields();
                    if (count($attributeSelectFields)) {
                        $selectFields = [...$selectFields, ...$attributeSelectFields];
                    }
                } else {
                    $selectFields[] = $fieldName; // default is just the attribute name
                }
            }

            // select relations
            if ($type->hasRelation($fieldName)) {
                $relationResolver = $relationResolvers[$fieldName];
                $selectFields = [
                    ...$selectFields,
                    ...$relationResolver->getOwnerIdFields()
                ];
            }

            // select attributes or relation on type
            if (preg_match('/^\@(.+)/', $fieldName, $matches)) {
                $onTypeName = $matches[1];
                if ($type::type() === $onTypeName) {
                    $selectFields = [
                        ...$selectFields,
                        ...$this->calculateSelectFields($type, $requestedFields->getNestedField($fieldName))
                    ];
                }
            }
        }

        return $selectFields;
    }

    protected function getTypeByName(string $typeName): Type
    {
        return $this->container->call(function (TypeClassMap $typeClassMap) use ($typeName) {
            $TypeClass = $typeClassMap->get($typeName) ?? Type::class;
            return $this->container->get($TypeClass);
        });
    }
}
