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
        $requestedFields = $this->request->getFields();

        $Type = $this->request->getAction()->getResponse()->getType();
        $type = $this->container->get($Type);

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

        $this->setVisibleFields($type, $models, $requestedFields);

        return array_values($models);
    }

    /**
     * @param ModelInterface[] $models
     */
    protected function setVisibleFields(Type $type, array $models, array $requestedFields): void
    {
        foreach ($models as $model) {
            $visibleFields = $this->getVisibleFields($type, $model, $requestedFields);
            $model->apiResourcesSetVisibleFields($visibleFields);

            foreach (array_keys($requestedFields) as $requestedField) {
                if ($type->hasRelation($requestedField)) {
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
        }
    }

    protected function getVisibleFields(Type $type, ModelInterface $model, array $requestedFields): array
    {
        $visibleFields = ['id', 'type'];

        foreach (array_keys($requestedFields) as $requestedField) {
            if ($type->hasAttribute($requestedField)) {
                $visibleFields[] = $requestedField;
            }

            if ($type->hasRelation($requestedField)) {
                $visibleFields[] = $requestedField;
            }

            if (preg_match('/^\@(.+)/', $requestedField, $matches)) {
                $onTypeName = $matches[1];
                if ($model->apiResourcesGetType() === $onTypeName) {
                    $OnType = $this->container->call(function (TypeClassMap $typeClassMap) use ($onTypeName) {
                        return $typeClassMap->getClass($onTypeName);
                    });
                    $onType = $this->container->get($OnType);

                    $visibleFields = array_unique(
                        array_merge(
                            $visibleFields,
                            $this->getVisibleFields($onType, $model, $requestedFields[$requestedField])
                        )
                    );
                }
            }
        }

        return $visibleFields;
    }
}
