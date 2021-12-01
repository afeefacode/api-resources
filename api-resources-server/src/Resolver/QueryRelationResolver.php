<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Api\RequestedFields;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackException;
use Afeefa\ApiResources\Model\ModelInterface;
use Closure;
use Generator;

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

    public function requestedFields(RequestedFields $fields): QueryRelationResolver
    {
        $this->requestedFields = $fields;
        return $this;
    }

    public function getRequestedFields(): RequestedFields
    {
        return $this->requestedFields;
    }

    public function getSelectFields(?string $typeName = null): array
    {
        $response = $this->requestedFields->getResponse();
        $relationName = $this->field->getName();

        if ($response->isUnion()) {
            if (!$typeName) {
                throw new InvalidConfigurationException("You need to pass a type name to getSelectFields() in the resolver of relation {$relationName} since the relation returns an union type");
            }
        } else {
            $typeName ??= $this->requestedFields->getResponse()->getTypeClass()::type();
        }

        if (!$response->allowsType($typeName)) {
            throw new InvalidConfigurationException("The type name passed to getSelectFields() in the resolver of relation {$relationName} is  not supported by the relation");
        }

        return $this->getResolveContext()->getSelectFields($typeName);
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

    public function resolve(): void
    {
        // if error
        $relationName = $this->field->getName();
        $resolverForRelation = "Resolver for relation {$relationName}";

        $resolveContext = $this->getResolveContext();

        // query db

        $loadCallback = $this->loadCallback;
        if (!$loadCallback) {
            throw new MissingCallbackException("{$resolverForRelation} needs to implement a load() method.");
        }
        $loadResult = $loadCallback($this->owners, $resolveContext);

        if ($loadResult instanceof Generator) {
            $loadResult = iterator_to_array($loadResult, false);
        }

        if (!is_array($loadResult)) {
            throw new InvalidConfigurationException("{$resolverForRelation} needs to return an array from its load() method.");
        }

        $models = [];

        // map results to owners

        // this is just a one-liner to detect if there are non-models in the given array
        $isAllModels = fn ($array) => !count(array_filter($array, fn ($elm) => !$elm instanceof ModelInterface));

        if (isset($this->mapCallback)) {
            $relationName = $this->field->getName();
            foreach ($this->owners as $owner) {
                $value = ($this->mapCallback)($loadResult, $owner);
                $owner->apiResourcesSetRelation($relationName, $value);
                $models[] = $value;
            }

            if ($this->field->getRelatedType()->isList()) {
                $models = array_merge(...$models); // make flat
                if (!$isAllModels($models)) {
                    throw new InvalidConfigurationException("{$resolverForRelation} needs to return an array of ModelInterface objects from its map() method.");
                }
            } else {
                if (!$isAllModels($models)) {
                    throw new InvalidConfigurationException("{$resolverForRelation} needs to return a ModelInterface object or null from its map() method.");
                }
            }
        } else {
            $models = $loadResult;

            if (!$isAllModels($models)) {
                throw new InvalidConfigurationException("{$resolverForRelation} needs to return an array of ModelInterface objects from its load() method.");
            }
        }

        // no objects -> no relations to resolve

        if (!count($models)) {
            return;
        }

        $attributeResolvers = $resolveContext->getAttributeResolvers();
        foreach ($attributeResolvers as $attributeResolver) {
            $attributeResolver->addOwners($models);
            $attributeResolver->resolve();
        }

        foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
            $relationResolver->addOwners($models);
            $relationResolver->resolve();
        }
    }

    protected function getResolveContext(): QueryResolveContext
    {
        if (!isset($this->resolveContext)) {
            $this->resolveContext = $this->container->create(QueryResolveContext::class)
                ->requestedFields($this->requestedFields);
        }
        return $this->resolveContext;
    }
}
