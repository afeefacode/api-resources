<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Api\ApiRequest;
use Closure;

class ActionResolver extends RelationLoader
{
    protected Action $action;

    protected ApiRequest $request;

    protected Closure $loadCallback;

    public function request(ApiRequest $request): ActionResolver
    {
        $this->request = $request;
        return $this;
    }

    public function action(Action $action): ActionResolver
    {
        $this->action = $action;
        return $this;
    }

    public function getAction(): Action
    {
        return $this->action;
    }

    public function load(Closure $callback): ActionResolver
    {
        $this->loadCallback = $callback;
        return $this;
    }

    public function fetch()
    {
        $requestedFields = $this->request->getFields();

        $resolveContext = $this
            ->resolveContext()
            ->requestedFields($requestedFields);

        $loadCallback = $this->loadCallback;
        $models = $loadCallback($resolveContext);

        foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
            foreach ($models as $model) {
                $relationResolver->addOwner($model);
            }
            $relationResolver->fetch();
        }

        $this->container->create(function (VisibleFields $visibleFields) use ($models, $requestedFields) {
            $visibleFields
                ->requestedFields($requestedFields)
                ->makeVisible($models);
        });

        return array_values($models);
    }

    protected function resolveContext(): ResolveContext
    {
        return $this->container->create(ResolveContext::class);
    }
}
