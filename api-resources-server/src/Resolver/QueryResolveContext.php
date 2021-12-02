<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\DI\DependencyResolver;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Type\Type;

class QueryResolveContext implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected array $fields;
    protected Type $type;

    /**
     * @var QueryAttributeResolver[]
     */
    protected array $attributeResolvers;

    /**
     * @var QueryRelationResolver[]
     */
    protected array $relationResolvers;

    public function type(Type $type): QueryResolveContext
    {
        $this->type = $type;
        return $this;
    }

    public function fields(array $fields): QueryResolveContext
    {
        $this->fields = $fields;
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

    public function getRequestedFields(): array
    {
        return $this->calculateRequestedFields($this->fields);
    }

    public function getSelectFields(): array
    {
        if (!isset($this->attributeResolvers)) {
            $this->createAttributeResolvers();
        }

        if (!isset($this->relationResolvers)) {
            $this->createRelationResolvers();
        }

        return $this->calculateSelectFields();
    }

    protected function createAttributeResolvers()
    {
        $type = $this->type;

        $attributeResolvers = [];
        foreach ($this->fields as $fieldName => $value) {
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
        $type = $this->type;

        $relationResolvers = [];

        $requestedFields = $this->getRequestedFields();

        foreach ($requestedFields as $fieldName => $value) {
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
                        ->fields($value);
                    $relationResolvers[$fieldName] = $relationResolver;
                } else {
                    throw new InvalidConfigurationException("Relation {$fieldName} on type {$type::type()} does not have a relation resolver.");
                }
            }
        }

        $this->relationResolvers = $relationResolvers;
    }

    protected function calculateSelectFields(): array
    {
        $type = $this->type;

        $attributeResolvers = $this->attributeResolvers;
        $relationResolvers = $this->relationResolvers;

        $selectFields = ['id']; // TODO this might be a problem if using no 'id' tables

        $requestedFields = $this->getRequestedFields();

        foreach ($requestedFields as $fieldName => $value) {
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
        }

        return $selectFields;
    }

    protected function calculateRequestedFields(array $fields): array
    {
        $type = $this->type;

        $requestedFields = [];

        foreach ($fields as $fieldName => $nested) {
            // count_relation
            if (preg_match('/^count_(.+)/', $fieldName, $matches)) {
                $countRelationName = $matches[1];
                if ($type->hasRelation($countRelationName)) {
                    $requestedFields[$fieldName] = true;
                }
            }

            // attribute
            if ($type->hasAttribute($fieldName) && $nested === true) {
                $requestedFields[$fieldName] = true;
            }

            // relation = true or [...]
            if ($type->hasRelation($fieldName)) {
                if ($nested === true) {
                    $nested = [];
                }
                if (is_array($nested)) {
                    $requestedFields[$fieldName] = $nested;
                }
            }

            // on type fields
            if (preg_match('/^\@(.+)/', $fieldName, $matches)) {
                $onTypeName = $matches[1];
                if ($type::type() === $onTypeName) {
                    if ($nested === true) {
                        $nested = [];
                    }
                    if (is_array($nested)) {
                        $requestedFields = array_merge(
                            $requestedFields,
                            $this->calculateRequestedFields($nested)
                        );
                    }
                }
            }
        }

        return $requestedFields;
    }
}
