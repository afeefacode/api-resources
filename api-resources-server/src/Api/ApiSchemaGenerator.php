<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\Field\Field;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Relation\Relation;
use Afeefa\ApiResources\Resource\Resource;
use Afeefa\ApiResources\Validator\Validator;

class ApiSchemaGenerator
{
    /**
     * @var array<Resource>
     */
    public array $resources = [];

    public function generate(): array
    {
        $visitor = new SchemaVisitor();

        $resources = array_map(function (Resource $resource) use ($visitor) {
            return $resource->toSchemaJson($visitor);
        }, $this->resources);

        $models = array_map(function (Model $model) use ($visitor) {
            return $model->toSchemaJson($visitor);
        }, $visitor->models);

        $models = array_map(function (Model $model) use ($visitor) {
            return $model->toSchemaJson($visitor);
        }, $visitor->models);

        $validators = array_map(function (Validator $validator) use ($visitor) {
            $json = $validator->toSchemaJson($visitor);
            unset($json['params']);
            return $json;
        }, $visitor->validators);

        $fields = array_map(function (Field $field) use ($visitor) {
            return $field->toSchemaJson($visitor);
        }, $visitor->fields);

        $relations = array_map(function (Relation $relation) use ($visitor) {
            return $relation->toSchemaJson($visitor);
        }, $visitor->relations);

        return [
            'models' => $models,
            'resources' => $resources,
            'validators' => $validators
            // 'fields' => $fields,
            // 'relations' => $relations,
        ];
    }

    public function add(string $Resource)
    {
        $resource = new $Resource();
        $this->resources[$resource->type] = $resource;
        return $this;
    }
}
