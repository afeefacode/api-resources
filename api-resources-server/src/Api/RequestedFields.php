<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\DB\TypeClassMap;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Type\Type;

class RequestedFields implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected string $TypeClass;

    /**
     * @var RequestedFields[]
     */
    protected array $fields;

    public function typeClass(string $TypeClass): RequestedFields
    {
        $this->TypeClass = $TypeClass;
        return $this;
    }

    public function getType(): Type
    {
        return $this->getTypeByClass();
    }

    public function fields(array $fields): RequestedFields
    {
        $this->fields = $this->normalize($this->getTypeByClass(), $fields);
        return $this;
    }

    public function getFieldNames(): array
    {
        return array_keys($this->fields);
    }

    public function getNestedField($fieldName): RequestedFields
    {
        return $this->fields[$fieldName];
    }

    /**
     * @param ModelInterface[] $models
     */
    public function setVisibleFields(Type $type, array $models, RequestedFields $fields): void
    {
        foreach ($models as $model) {
            $visibleFields = $this->getVisibleFields($type, $model, $fields);
            $model->apiResourcesSetVisibleFields($visibleFields);

            foreach ($fields->getFieldNames() as $fieldName) {
                if ($type->hasRelation($fieldName)) {
                    $relation = $type->getRelation($fieldName);
                    $relatedType = $relation->getRelatedTypeInstance();
                    if ($relation->isSingle()) {
                        if ($model->$fieldName) {
                            $this->setVisibleFields($relatedType, [$model->$fieldName], $fields->getNestedField($fieldName));
                        }
                    } else {
                        if (is_array($model->$fieldName)) {
                            $this->setVisibleFields($relatedType, $model->$fieldName, $fields->getNestedField($fieldName));
                        }
                    }
                }
            }
        }
    }

    protected function getVisibleFields(Type $type, ModelInterface $model, RequestedFields $fields): array
    {
        $visibleFields = ['id', 'type'];

        foreach ($fields->getFieldNames() as $fieldName) {
            if ($type->hasAttribute($fieldName)) {
                $visibleFields[] = $fieldName;
            }

            if ($type->hasRelation($fieldName)) {
                $visibleFields[] = $fieldName;
            }

            if (preg_match('/^\@(.+)/', $fieldName, $matches)) {
                $onTypeName = $matches[1];
                if ($model->apiResourcesGetType() === $onTypeName) {
                    $onType = $this->getTypeByName($onTypeName);
                    $visibleFields = array_unique(
                        array_merge(
                            $visibleFields,
                            $this->getVisibleFields($onType, $model, $fields->getNestedField($fieldName))
                        )
                    );
                }
            }
        }

        return $visibleFields;
    }

    protected function normalize(Type $type, array $fields): array
    {
        $normalizedFields = [];
        foreach ($fields as $fieldName => $nested) {
            if ($type->hasAttribute($fieldName)) {
                $normalizedFields[$fieldName] = true;
            }

            if ($type->hasRelation($fieldName)) {
                if ($nested === true) {
                    $nested = [];
                }
                if (is_array($nested)) {
                    $TypeClass = $type->getRelation($fieldName)->getRelatedType();
                    $normalizedFields[$fieldName] = $this->createNestedFields($TypeClass, $nested);
                }
            }

            if (preg_match('/^\@(.+)/', $fieldName, $matches)) {
                if ($nested === true) {
                    $nested = [];
                }
                if (is_array($nested)) {
                    $TypeClass = $this->getTypeClassByName($matches[1]);
                    $normalizedFields[$fieldName] = $this->createNestedFields($TypeClass, $nested);
                }
            }
        }

        return $normalizedFields;
    }

    protected function getTypeByClass(string $TypeClass = null): Type
    {
        $TypeClass = $TypeClass ?: $this->TypeClass;
        return $this->container->get($TypeClass);
    }

    protected function getTypeByName(string $typeName): Type
    {
        $TypeClass = $this->getTypeClassByName($typeName);
        return $this->getTypeByClass($TypeClass);
    }

    protected function getTypeClassByName(string $typeName = null): string
    {
        return $this->container->call(function (TypeClassMap $typeClassMap) use ($typeName) {
            return $typeClassMap->getClass($typeName);
        });
    }

    protected function createNestedFields(string $TypeClass, array $fields): RequestedFields
    {
        return $this->container->create(function (RequestedFields $requestedFields) use ($TypeClass, $fields) {
            $requestedFields
                ->typeClass($TypeClass)
                ->fields($fields);
        });
    }
}
