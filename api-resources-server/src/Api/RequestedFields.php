<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\Action\ActionResponse;
use Afeefa\ApiResources\DB\TypeClassMap;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Type\Type;
use JsonSerializable;

class RequestedFields implements ContainerAwareInterface, JsonSerializable, ToSchemaJsonInterface
{
    use ContainerAwareTrait;

    protected string $TypeClass;
    protected Type $type;
    protected array $fields;
    protected ActionResponse $response;

    public function response(ActionResponse $response): RequestedFields
    {
        $this->response = $response;
        return $this;
    }

    public function getResponse(): ActionResponse
    {
        return $this->response;
    }

    public function getType(): Type
    {
        if (!isset($this->type)) {
            $TypeClass = $this->response->getAllTypeClasses()[0];
            $this->type = $this->container->get($TypeClass);
        }
        return $this->type;
    }

    public function fields(array $fields): RequestedFields
    {
        $this->fields = $this->normalize($fields);
        return $this;
    }

    public function hasField(string $fieldName): bool
    {
        return isset($this->fields[$fieldName]);
    }

    public function getFieldNames(): array
    {
        return array_keys($this->fields);
    }

    /**
     * @return Attribute[]
     */
    public function getAttributes(): array
    {
        $type = $this->getType();
        $attributes = [];
        foreach ($this->getFieldNames() as $fieldName) {
            if ($type->hasAttribute($fieldName)) {
                $attributes[$fieldName] = $type->getAttribute($fieldName);
            }
        }
        return $attributes;
    }

    /**
     * @return Relation[]
     */
    public function getRelations(): array
    {
        $type = $this->getType();
        $relations = [];
        foreach ($this->getFieldNames() as $fieldName) {
            if ($type->hasRelation($fieldName)) {
                $relations[$fieldName] = $type->getRelation($fieldName);
            }
        }
        return $relations;
    }

    public function getFieldNamesForType(Type $type): array
    {
        $fieldNames = [];
        foreach ($this->fields as $fieldName => $nested) {
            if (preg_match('/^\@(.+)/', $fieldName, $matches)) {
                if ($type::type() === $matches[1]) {
                    $fieldNames = array_merge($fieldNames, $nested->getFieldNames());
                }
            } else {
                $fieldNames[] = $fieldName;
            }
        }
        return $fieldNames;
    }

    public function getNestedField($fieldName): ?RequestedFields
    {
        return $this->fields[$fieldName] ?? null;
    }

    public function toSchemaJson(): array
    {
        $json = [];
        foreach ($this->fields as $name => $field) {
            if ($field === true) {
                $json[$name] = true;
            }
            if ($field instanceof RequestedFields) {
                $json[$name] = $field->toSchemaJson();
            }
        }
        return $json;
    }

    public function jsonSerialize()
    {
        return $this->fields;
    }

    protected function normalize(array $fields): array
    {
        $type = $this->getType();
        $normalizedFields = [];

        foreach ($fields as $fieldName => $nested) {
            if (preg_match('/^count_(.+)/', $fieldName, $matches)) {
                $countRelationName = $matches[1];
                if ($type->hasRelation($countRelationName)) {
                    $normalizedFields[$fieldName] = true;
                }
            }

            if ($type->hasAttribute($fieldName) && $nested === true) {
                $normalizedFields[$fieldName] = true;
            }

            if ($type->hasRelation($fieldName)) {
                if ($nested === true) {
                    $nested = [];
                }
                if (is_array($nested)) {
                    $response = $type->getRelation($fieldName)->getRelatedType();
                    $normalizedFields[$fieldName] = $this->createNestedFields($response, $nested);
                }
            }

            if (preg_match('/^\@(.+)/', $fieldName, $matches)) {
                if ($nested === true) {
                    $nested = [];
                }
                if (is_array($nested)) {
                    $TypeClass = $this->getTypeClassByName($matches[1]);

                    if ($TypeClass) {
                        $response = $this->container->create(ActionResponse::class)
                            ->typeClass($TypeClass);
                        $normalizedFields[$fieldName] = $this->createNestedFields($response, $nested);
                    }
                }
            }
        }

        return $normalizedFields;
    }

    protected function getTypeClassByName(string $typeName = null): ?string
    {
        return $this->container->call(function (TypeClassMap $typeClassMap) use ($typeName) {
            return $typeClassMap->get($typeName);
        });
    }

    protected function createNestedFields(ActionResponse $response, array $fields): RequestedFields
    {
        return $this->container->create(function (RequestedFields $requestedFields) use ($response, $fields) {
            $requestedFields
                ->response($response)
                ->fields($fields);
        });
    }
}
