<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Type\Type;
use Closure;

class TypeLoader extends RelationLoader
{
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
                        if (is_array($model->$requestedField)) {
                            $this->setVisibleFields($relatedType, $model->$requestedField, $requestedFields[$requestedField]);
                        }
                    }
                }
            }

            $model->apiResourcesSetVisibleFields($visibleFields);
        }

        return $models;
    }
}
