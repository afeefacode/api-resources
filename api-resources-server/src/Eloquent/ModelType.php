<?php

namespace Afeefa\ApiResources\Eloquent;

use Afeefa\ApiResources\Type\ModelType as ApiResourcesModelType;

class ModelType extends ApiResourcesModelType
{
    protected function getEloquentRelationResolver(string $ModelClass): ModelResolver
    {
        return (new ModelResolver())
            ->modelClass($ModelClass);
    }
}
