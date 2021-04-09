<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Api\ApiRequest;
use Closure;

class ActionResolver extends DataResolver
{
    protected Action $action;

    protected ApiRequest $request;

    protected Closure $loadCallback;

    public function request(ApiRequest $request): ActionResolver
    {
        $this->request = $request;
        return $this;
    }

    public function getRequest(): ApiRequest
    {
        return $this->request;
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

        // query db

        $loadCallback = $this->loadCallback;
        $models = $loadCallback($resolveContext);

        if (count($models)) {
            // resolve relations

            foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
                foreach ($models as $model) {
                    $relationResolver->addOwner($model);
                }
                $relationResolver->fetch();
            }

            // mark visible fields

            $this->container->create(function (VisibleFields $visibleFields) use ($models, $requestedFields) {
                $visibleFields
                    ->requestedFields($requestedFields)
                    ->makeVisible($models);
            });
        }

        return [
            'data' => array_values($models),
            'meta' => $resolveContext->getMeta(),
            'request' => $this->request
        ];
    }
}