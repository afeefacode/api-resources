<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\Field\Field;
use Afeefa\ApiResources\Relation\Relation;
use Afeefa\ApiResources\Resource\ResourceBag;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validator;

class Api
{
    protected ResourceBag $resources;

    public function __construct()
    {
        $this->resources = new ResourceBag();
        $this->resources($this->resources);
    }

    public function resources(ResourceBag $resources): void
    {
    }

    public function request(ApiRequest $request)
    {
        return $request;
    }

    public function toSchemaJson(): array
    {
        $visitor = new SchemaVisitor();

        $resources = $this->resources->toSchemaJson($visitor);

        $types = array_map(function (Type $type) use ($visitor) {
            return $type->toSchemaJson($visitor);
        }, $visitor->types);

        $types = array_map(function (Type $type) use ($visitor) {
            return $type->toSchemaJson($visitor);
        }, $visitor->types);

        $types = array_map(function (Type $type) use ($visitor) {
            return $type->toSchemaJson($visitor);
        }, $visitor->types);

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
            'types' => $types,
            'resources' => $resources,
            'validators' => $validators
            // 'fields' => $fields,
            // 'relations' => $relations,
        ];
    }
}
