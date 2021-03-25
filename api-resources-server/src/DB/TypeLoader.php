<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Model\ModelInterface;
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
        $type = $requestedFields->getType();

        $relationResolvers = $this->createRelationResolvers($type, $requestedFields);
        $selectFields = $this->getSelectFields($type, $requestedFields, $relationResolvers);

        $models = $callback($selectFields);

        foreach ($relationResolvers as $requestedField => $relationResolver) {
            foreach ($models as $model) {
                $relationResolver->addOwner($model);
            }

            $relationResolver->requestedFields($requestedFields->getNestedField($requestedField));
            $relationResolver->fetch();
        }

        $requestedFields->setVisibleFields($type, $models, $requestedFields);

        return array_values($models);
    }
}
