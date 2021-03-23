<?php

namespace Afeefa\ApiResources\Model;

use JsonSerializable;

class Model implements ModelInterface, JsonSerializable
{
    protected array $visibleFields = [];

    /**
     * @return ModelInterface[]
     */
    public static function fromList(array $objects): array
    {
        $models = [];
        foreach ($objects as $object) {
            $models[] = static::fromSingle($object);
        }
        return $models;
    }

    public static function fromSingle($object): ModelInterface
    {
        if ($object instanceof ModelInterface) {
            return $object;
        }

        $model = new Model();
        $model->setAttributes($object);
        return $model;
    }

    public function __construct(array $attributes = [])
    {
        $this->setAttributes($attributes);
    }

    public function apiResourcesSetAttribute(string $name, $value): void
    {
        $this->$name = $value;
    }

    public function apiResourcesSetVisibleFields(array $fields): void
    {
        $this->visibleFields = $fields;
    }

    public function apiResourcesSetRelation(string $name, $value): void
    {
        $this->$name = $value;
    }

    public function jsonSerialize()
    {
        $json = [];
        foreach ($this as $name => $value) {
            if (in_array($name, $this->visibleFields)) {
                $json[$name] = $value;
            }
        }
        return $json;
    }

    protected function setAttributes(array $attributes = [])
    {
        foreach ($attributes as $key => $value) {
            $this->apiResourcesSetAttribute($key, $value);
        }
    }
}
