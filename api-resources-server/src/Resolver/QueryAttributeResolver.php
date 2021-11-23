<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackException;
use Closure;

class QueryAttributeResolver extends BaseAttributeResolver
{
    protected array $selectFields = [];

    protected ?Closure $loadCallback = null;

    protected ?Closure $mapCallback = null;

    public function select($selectFields): QueryAttributeResolver
    {
        $this->selectFields = is_array($selectFields)
            ? $selectFields
            : [$selectFields];
        return $this;
    }

    public function getSelectFields(): array
    {
        return $this->selectFields;
    }

    public function load(Closure $callback): QueryAttributeResolver
    {
        $this->loadCallback = $callback;
        return $this;
    }

    public function map(Closure $callback): QueryAttributeResolver
    {
        $this->mapCallback = $callback;
        return $this;
    }

    public function resolve()
    {
        // if error
        $attributeName = $this->field->getName();
        $resolverForAttribute = "Resolver for attribute {$attributeName}";

        // query db

        if (!$this->loadCallback) {
            if (count($this->selectFields)) {
                return; // only select fields are set up
            }
            throw new MissingCallbackException("{$resolverForAttribute} needs to implement a load() method.");
        }
        $objects = ($this->loadCallback)($this->owners);

        // map results to owners

        if (isset($this->mapCallback)) {
            if (!is_array($objects)) {
                throw new InvalidConfigurationException("{$resolverForAttribute} needs to return an array if map() is used.");
            }

            $mapCallback = $this->mapCallback;
            $attributeName = $this->field->getName();

            foreach ($this->owners as $owner) {
                $value = $mapCallback($objects, $owner);
                $owner->apiResourcesSetAttribute($attributeName, $value);
            }
        }
    }
}
