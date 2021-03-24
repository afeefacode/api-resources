<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\DI\Resolver;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Type\Type;

class RelationLoader implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * @return RelationResolver[]
     */
    protected function createRelationResolvers(Type $type, array $requestedFields): array
    {
        $relationResolvers = [];
        foreach (array_keys($requestedFields) as $requestedField) {
            if ($type->hasRelation($requestedField)) {
                $relation = $type->getRelation($requestedField);
                $resolveCallback = $relation->getResolve();

                /** @var RelationResolver */
                $relationResolver = null;

                if ($resolveCallback) {
                    $this->container->call(
                        $resolveCallback,
                        function (Resolver $r) {
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
                        throw new InvalidConfigurationException("Resolve callback for relation {$requestedField} on type {$type::$type} must receive RelationResolver argument.");
                    }

                    $relationResolver->relation($relation);
                    $relationResolvers[$requestedField] = $relationResolver;
                } else {
                    throw new InvalidConfigurationException("Relation {$requestedField} on type {$type::$type} does not have a relation resolver.");
                }
            }
        }
        return $relationResolvers;
    }

    /**
     * @param RelationResolver[] $relationResolvers
     */
    protected function getSelectFields(Type $type, array $requestedFields, array $relationResolvers): array
    {
        $selectFields = ['id'];

        foreach (array_keys($requestedFields) as $requestedField) {
            if ($type->hasAttribute($requestedField)) {
                $selectFields[] = $requestedField;
            }

            if ($type->hasRelation($requestedField)) {
                $relationResolver = $relationResolvers[$requestedField];
                $selectFields = array_unique(
                    array_merge(
                        $selectFields,
                        $relationResolver->getOwnerIdFields()
                    )
                );
            }
        }

        return $selectFields;
    }
}
