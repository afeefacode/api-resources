<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\DI\Resolver;
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
        $requestedFields = $this->request->getFields();

        $relationLoaders = $this->createRelationLoaders($type, $requestedFields);
        $selectFields = $this->getSelectFields($type, $requestedFields, $relationLoaders);

        $models = $callback($selectFields['this']);

        foreach ($relationLoaders as $requestedField => $relationLoader) {
            foreach ($models as $model) {
                $relationLoader->owner($model);
            }

            $relationLoader->selectFields($selectFields[$requestedField]);
            $value = $relationLoader->get();

            $owners = $relationLoader->getOwners();
            foreach ($owners as $owner) {
                $relatedId = $owner->{$relationLoader->getOwnerKey()};
                $owner->apiResourcesSetRelation($requestedField, $value[$relatedId]);
            }
        }

        $models = $this->setVisibleFields($type, $models, $requestedFields);

        return array_values($models);
    }

    /**
     * @return RelationLoader[]
     */
    protected function createRelationLoaders(Type $type, array $requestedFields): array
    {
        $relationLoaders = [];
        foreach (array_keys($requestedFields) as $requestedField) {
            if ($type->hasRelation($requestedField)) {
                $relation = $type->getRelation($requestedField);
                $resolver = $relation->getResolver();

                $relationLoader = new RelationLoader();
                $this->container->call($resolver, function (Resolver $r) use ($relationLoader) {
                    if ($r->isOf(RelationLoader::class)) {
                        $r->fix($relationLoader);
                    }
                });

                $relationLoaders[$requestedField] = $relationLoader;
            }
        }
        return $relationLoaders;
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
     * @param RelationLoader[] $relationLoaders
     */
    protected function getSelectFields(Type $type, array $requestedFields, array $relationLoaders): array
    {
        $fieldsMap = [
            'this' => ['id']
        ];

        foreach ($requestedFields as $requestedField => $nested) {
            if ($type->hasAttribute($requestedField)) {
                $fieldsMap['this'][] = $requestedField;
            }

            if ($type->hasRelation($requestedField)) {
                $relationLoader = $relationLoaders[$requestedField];

                $ownerKey = $relationLoader->getOwnerKey();
                if ($ownerKey) {
                    $fieldsMap['this'] = array_unique(
                        array_merge(
                            $fieldsMap['this'],
                            [$ownerKey]
                        )
                    );
                }

                $relatedKey = $relationLoader->getRelatedKey();
                if ($relatedKey) {
                    $fieldsMap[$requestedField] = array_unique(
                        array_merge(
                            ['id'],
                            array_keys($nested),
                            [$relatedKey]
                        )
                    );
                }
            }
        }

        return $fieldsMap;
    }
}
