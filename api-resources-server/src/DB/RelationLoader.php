<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\Api\RequestedFields;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\DI\DependencyResolver;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Type\Type;

class RelationLoader implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * @return RelationResolver[]
     */
    protected function createRelationResolvers(Type $type, RequestedFields $fields): array
    {
        $relationResolvers = [];
        foreach ($fields->getFieldNames() as $fieldName) {
            if ($type->hasRelation($fieldName)) {
                $relation = $type->getRelation($fieldName);
                $resolveCallback = $relation->getResolve();

                /** @var RelationResolver */
                $relationResolver = null;

                if ($resolveCallback) {
                    $this->container->call(
                        $resolveCallback,
                        function (DependencyResolver $r) {
                            if ($r->isOf(RelationResolver::class)) {
                                $r->create();
                            }
                        },
                        function () use (&$relationResolver) {
                            $arguments = func_get_args();
                            foreach ($arguments as $argument) {
                                if ($argument instanceof RelationResolver) {
                                    $relationResolver = $argument;
                                }
                            }
                        }
                    );

                    if (!$relationResolver) {
                        throw new InvalidConfigurationException("Resolve callback for relation {$fieldName} on type {$type::$type} must receive a RelationResolver as argument.");
                    }

                    $relationResolver->relation($relation);
                    $relationResolvers[$fieldName] = $relationResolver;
                } else {
                    throw new InvalidConfigurationException("Relation {$fieldName} on type {$type::$type} does not have a relation resolver.");
                }
            }
        }
        return $relationResolvers;
    }

    /**
     * @param RelationResolver[] $relationResolvers
     */
    protected function getSelectFields(Type $type, RequestedFields $fields, array $relationResolvers): array
    {
        $selectFields = ['id'];

        foreach ($fields->getFieldNames() as $fieldName) {
            if ($type->hasAttribute($fieldName)) {
                $selectFields[] = $fieldName;
            }

            if ($type->hasRelation($fieldName)) {
                $relationResolver = $relationResolvers[$fieldName];
                $selectFields = array_unique(
                    array_merge(
                        $selectFields,
                        $relationResolver->getOwnerIdFields()
                    )
                );
            }

            if (preg_match('/^\@(.+)/', $fieldName, $matches)) {
                $onTypeName = $matches[1];
                if ($type::$type === $onTypeName) {
                    $selectFields = array_unique(
                        array_merge(
                            $selectFields,
                            $this->getSelectFields($type, $fields->getNestedField($fieldName), $relationResolvers)
                        )
                    );
                }
            }
        }

        return $selectFields;
    }
}
