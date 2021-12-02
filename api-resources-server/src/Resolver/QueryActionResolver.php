<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\DB\TypeClassMap;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackException;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Type\Type;
use Closure;

class QueryActionResolver extends BaseActionResolver
{
    protected array $resolveContexts = [];

    protected Closure $loadCallback;

    protected array $meta = [];

    public function load(Closure $callback): QueryActionResolver
    {
        $this->loadCallback = $callback;
        return $this;
    }

    public function meta(array $meta): QueryActionResolver
    {
        $this->meta = $meta;
        return $this;
    }

    public function getRequestedFields(?string $typeName = null): array
    {
        $action = $this->request->getAction();
        $response = $action->getResponse();

        // if errors

        $actionName = $action->getName();
        $resourceType = $this->request->getResource()::type();

        if ($response->isUnion()) {
            if (!$typeName) {
                throw new InvalidConfigurationException("You need to pass a type name to getRequestedFields() in the resolver of action {$actionName} on resource {$resourceType} since the action returns an union type.");
            }
        } else {
            $typeName ??= $response->getTypeClass()::type();
        }

        if (!$response->allowsType($typeName)) {
            throw new InvalidConfigurationException("The type name passed to getRequestedFields() in the resolver of action {$actionName} on resource {$resourceType} is not supported by the action.");
        }

        return $this->getResolveContext($typeName)->getRequestedFields();
    }

    public function getRequestedFieldNames(?string $typeName = null): array
    {
        return array_keys($this->getRequestedFields($typeName));
    }

    public function getSelectFields(?string $typeName = null): array
    {
        $action = $this->request->getAction();
        $response = $action->getResponse();

        // if errors

        $actionName = $action->getName();
        $resourceType = $this->request->getResource()::type();

        if ($response->isUnion()) {
            if (!$typeName) {
                throw new InvalidConfigurationException("You need to pass a type name to getSelectFields() in the resolver of action {$actionName} on resource {$resourceType} since the action returns an union type.");
            }
        } else {
            $typeName ??= $response->getTypeClass()::type();
        }

        if (!$response->allowsType($typeName)) {
            throw new InvalidConfigurationException("The type name passed to getSelectFields() in the resolver of action {$actionName} on resource {$resourceType} is not supported by the action.");
        }

        return $this->getResolveContext($typeName)->getSelectFields($typeName);
    }

    public function resolve(): array
    {
        $action = $this->request->getAction();

        // if errors

        $actionName = $action->getName();
        $resourceType = $this->request->getResource()::type();
        $mustReturn = "Load callback of action resolver for action {$actionName} on resource {$resourceType} must return";

        // query db

        if (!isset($this->loadCallback)) {
            throw new MissingCallbackException("Action resolver for action {$actionName} on resource {$resourceType} must provide a load callback.");
        }

        $modelOrModels = ($this->loadCallback)();
        /** @var ModelInterface[] */
        $models = [];
        $hasResult = false;
        $isList = false;

        if ($action->getResponse()->isList()) {
            if (!is_array($modelOrModels)) {
                throw new InvalidConfigurationException("{$mustReturn} an array of ModelInterface objects.");
            }
            foreach ($modelOrModels as $model) {
                if (!$model instanceof ModelInterface) {
                    throw new InvalidConfigurationException("{$mustReturn} an array of ModelInterface objects.");
                }
                if (!$action->getResponse()->allowsType($model->apiResourcesGetType())) {
                    $allowedTypeNames = implode(',', $action->getResponse()->getAllTypeNames());
                    throw new InvalidConfigurationException("{$mustReturn} an array of ModelInterface objects of type [{$allowedTypeNames}].");
                }
            }
            $models = $modelOrModels;
            $hasResult = count($models) > 0;
            $isList = true;
        } else {
            if ($modelOrModels !== null) {
                if (!$modelOrModels instanceof ModelInterface) {
                    throw new InvalidConfigurationException("{$mustReturn} a ModelInterface object.");
                }
                if (!$action->getResponse()->allowsType($modelOrModels->apiResourcesGetType())) {
                    $allowedTypeNames = implode(',', $action->getResponse()->getAllTypeNames());
                    throw new InvalidConfigurationException("{$mustReturn} a ModelInterface object of type [{$allowedTypeNames}].");
                }
            }
            $models = $modelOrModels ? [$modelOrModels] : [];
            $hasResult = !!$modelOrModels;
        }

        if ($hasResult) {
            $modelsByType = $this->getModelsByType($models);

            foreach ($modelsByType as $typeName => $models) {
                $resolveContext = $this->getResolveContext($typeName);

                // resolve attributes

                foreach ($resolveContext->getAttributeResolvers() as $attributeResolver) {
                    $attributeResolver->addOwners($models);
                    $attributeResolver->resolve();
                }

                // resolve relations

                foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
                    $relationResolver->addOwners($models);
                    $relationResolver->resolve();
                }

                // mark visible fields

                $requestedFields = $this->getRequestedFields($typeName);
                foreach ($models as $model) {
                    $model->apiResourcesSetVisibleFields(['id', 'type', ...array_keys($requestedFields)]);
                }
            }
        }

        return [
            'data' => $isList ? array_values($modelOrModels) : $modelOrModels,
            'meta' => $this->meta,
            'input' => json_decode(file_get_contents('php://input'), true),
            'request' => $this->request
        ];
    }

    /**
     * @param ModelInterface[] $models
     */
    protected function getModelsByType(array $models): array
    {
        $modelsByType = [];
        foreach ($models as $model) {
            $type = $model->apiResourcesGetType();
            $modelsByType[$type][] = $model;
        }
        return $modelsByType;
    }

    protected function getResolveContext(string $typeName): QueryResolveContext
    {
        if (!isset($this->resolveContexts[$typeName])) {
            $this->resolveContexts[$typeName] = $this->container->create(function (QueryResolveContext $resolveContext) use ($typeName) {
                $resolveContext
                    ->type($this->getTypeByName($typeName))
                    ->fields($this->request->getFields());
            });
        }
        return $this->resolveContexts[$typeName];
    }

    protected function getTypeByName(string $typeName): Type
    {
        return $this->container->call(function (TypeClassMap $typeClassMap) use ($typeName) {
            $TypeClass = $typeClassMap->get($typeName) ?? Type::class;
            return $this->container->get($TypeClass);
        });
    }
}
