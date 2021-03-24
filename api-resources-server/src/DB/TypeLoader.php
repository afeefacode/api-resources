<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\DI\Resolver;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Type\Type;
use Closure;

class TypeLoader implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected ApiRequest $request;

    protected Closure $loadCallback;

    public function request(ApiRequest $request): void
    {
        $this->request = $request;
    }

    /**
     * @return ModelInterface[]
     */
    public function load(Closure $callback): array
    {
        $Type = $this->request->getAction()->getResponse()->getType();
        /** @var Type */
        $type = $this->container->get($Type);
        $requestedFields = $this->getNormalizedRequestedFields($type, $this->request->getFields());

        $relationResolvers = $this->createRelationResolvers($type, $requestedFields);
        $selectFields = $this->getSelectFields($type, $requestedFields, $relationResolvers);

        $models = $callback($selectFields);

        foreach ($relationResolvers as $requestedField => $relationResolver) {
            foreach ($models as $model) {
                $relationResolver->addOwner($model);
            }

            $relationResolver->requestedFields($requestedFields[$requestedField]);
            $relationResolver->fetch();
        }

        $models = $this->setVisibleFields($type, $models, $requestedFields);

        return array_values($models);
    }

    protected function getNormalizedRequestedFields(Type $type, array $requestedFields): array
    {
        $normalizedFields = [];
        foreach ($requestedFields as $requestedField => $nested) {
            if ($type->hasAttribute($requestedField)) {
                $normalizedFields[$requestedField] = true;
            }

            if ($type->hasRelation($requestedField)) {
                if (is_array($nested)) {
                    $normalizedFields[$requestedField] = $nested;
                }
            }
        }

        return $normalizedFields;
    }

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
     * @param ModelInterface[] $models
     */
    protected function setVisibleFields(Type $type, array $models, array $requestedFields)
    {
        foreach ($models as $model) {
            $visibleFields = ['id', 'type'];

            foreach (array_keys($requestedFields) as $requestedField) {
                if ($type->hasAttribute($requestedField)) {
                    $visibleFields[] = $requestedField;
                }

                if ($type->hasRelation($requestedField)) {
                    $visibleFields[] = $requestedField;

                    $relation = $type->getRelation($requestedField);
                    $relatedType = $relation->getRelatedTypeInstance();

                    if ($relation->isSingle()) {
                        if ($model->$requestedField) {
                            $this->setVisibleFields($relatedType, [$model->$requestedField], $requestedFields[$requestedField]);
                        }
                    } else {
                        $this->setVisibleFields($relatedType, $model->$requestedField, $requestedFields[$requestedField]);
                    }
                }
            }

            $model->apiResourcesSetVisibleFields($visibleFields);
        }

        return $models;
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
