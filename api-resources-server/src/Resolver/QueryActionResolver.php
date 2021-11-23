<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Api\RequestedFields;
use Afeefa\ApiResources\DB\VisibleFields;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackException;
use Afeefa\ApiResources\Model\ModelInterface;
use Closure;

class QueryActionResolver extends BaseActionResolver
{
    protected QueryResolveContext $resolveContext;

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

    public function getRequestedFields(): RequestedFields
    {
        return $this->request->getFields();
    }

    public function getSelectFields(): array
    {
        return $this->getResolveContext()->getSelectFields();
    }

    protected function getResolveContext(): QueryResolveContext
    {
        if (!isset($this->resolveContext)) {
            $this->resolveContext = $this->container->create(QueryResolveContext::class)
                ->requestedFields($this->request->getFields());
        }
        return $this->resolveContext;
    }

    public function resolve(): array
    {
        $action = $this->request->getAction();
        $resolveContext = $this->getResolveContext();
        $requestedFields = $this->request->getFields();

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
            }
            $models = $modelOrModels;
            $hasResult = count($models) > 0;
            $isList = true;
        } else {
            if ($modelOrModels !== null && !$modelOrModels instanceof ModelInterface) {
                throw new InvalidConfigurationException("{$mustReturn} a ModelInterface object or null.");
            }
            $models = $modelOrModels ? [$modelOrModels] : [];
            $hasResult = !!$modelOrModels;
        }

        if ($hasResult) {
            // resolve attributes

            foreach ($resolveContext->getAttributeResolvers() as $attributeResolver) {
                foreach ($models as $model) {
                    $attributeResolver->addOwner($model);
                }
                $attributeResolver->resolve();
            }

            // resolve relations

            foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
                foreach ($models as $model) {
                    $relationResolver->addOwner($model);
                }
                $relationResolver->resolve();
            }

            // mark visible fields

            $this->container->create(function (VisibleFields $visibleFields) use ($models, $requestedFields) {
                $visibleFields
                    ->requestedFields($requestedFields)
                    ->makeVisible($models);
            });
        }

        return [
            'data' => $isList ? array_values($modelOrModels) : $modelOrModels,
            'meta' => $this->meta,
            'input' => json_decode(file_get_contents('php://input'), true),
            'request' => $this->request
        ];
    }
}
