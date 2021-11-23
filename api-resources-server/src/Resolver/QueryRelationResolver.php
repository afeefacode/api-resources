<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Api\RequestedFields;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackException;
use Closure;

/**
 * @method QueryRelationResolver ownerType(Type $ownerType)
 * @method QueryRelationResolver relation(Relation $relation)
 */
class QueryRelationResolver extends BaseRelationResolver
{
    protected RequestedFields $requestedFields;

    protected QueryResolveContext $resolveContext;

    /**
     * Closure or array
     */
    protected $ownerIdFields;

    protected ?Closure $loadCallback = null;

    protected ?Closure $mapCallback = null;

    protected ?Closure $flattenCallback = null;

    public function requestedFields(RequestedFields $fields): QueryRelationResolver
    {
        $this->requestedFields = $fields;
        return $this;
    }

    public function getRequestedFields(): RequestedFields
    {
        return $this->requestedFields;
    }

    public function getSelectFields(): array
    {
        return $this->getResolveContext()->getSelectFields();
    }

    public function ownerIdFields($ownerIdFields): QueryRelationResolver
    {
        $this->ownerIdFields = $ownerIdFields;
        return $this;
    }

    public function getOwnerIdFields(): array
    {
        if ($this->ownerIdFields instanceof Closure) {
            return ($this->ownerIdFields)() ?? [];
        }

        return $this->ownerIdFields ?? [];
    }

    public function load(Closure $callback): QueryRelationResolver
    {
        $this->loadCallback = $callback;
        return $this;
    }

    public function map(Closure $callback): QueryRelationResolver
    {
        $this->mapCallback = $callback;
        return $this;
    }

    public function flatten(Closure $callback): QueryRelationResolver
    {
        $this->flattenCallback = $callback;
        return $this;
    }

    protected function getResolveContext(): QueryResolveContext
    {
        if (!isset($this->resolveContext)) {
            $this->resolveContext = $this->container->create(QueryResolveContext::class)
                ->requestedFields($this->requestedFields);
        }
        return $this->resolveContext;
    }

    public function resolve(): void
    {
        $resolveContext = $this->getResolveContext();

        // query db

        $loadCallback = $this->loadCallback;
        if (!$loadCallback) {
            throw new MissingCallbackException('resolve callback needs to implement a load() method.');
        }
        $objects = $loadCallback($this->owners, $resolveContext);

        if (!is_array($objects)) {
            throw new InvalidConfigurationException('load() method of a relation resolver must return an array of ModelInterace objects.');
        }

        // map results to owners

        if (isset($this->mapCallback)) {
            $mapCallback = $this->mapCallback;
            $relationName = $this->field->getName();

            foreach ($this->owners as $owner) {
                $value = $mapCallback($objects, $owner);
                $owner->apiResourcesSetRelation($relationName, $value);
            }
        }

        // no objects -> no relations to resolve

        if (!count($objects)) {
            return;
        }

        // resolve attributes and sub relations

        if (isset($this->flattenCallback)) {
            $models = ($this->flattenCallback)($objects);
        } else {
            $models = array_values($objects);
            // nested array
            if (is_array($models[0] ?? null)) {
                $models = array_merge(...$models);
            }
        }

        $attributeResolvers = $resolveContext->getAttributeResolvers();
        foreach ($attributeResolvers as $attributeResolver) {
            foreach ($models as $model) {
                $attributeResolver->addOwner($model);
            }
            $attributeResolver->resolve();
        }

        foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
            foreach ($models as $model) {
                $relationResolver->addOwner($model);
            }
            $relationResolver->resolve();
        }
    }
}
