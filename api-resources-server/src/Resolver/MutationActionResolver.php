<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Api\FieldsToSave;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Model\ModelInterface;
use Closure;

class MutationActionResolver extends BaseActionResolver
{
    protected MutationResolveContext $resolveContext;

    protected Closure $saveCallback;

    protected Closure $forwardCallback;

    public function save(Closure $callback): MutationActionResolver
    {
        $this->saveCallback = $callback;
        return $this;
    }

    public function forward(Closure $callback): MutationActionResolver
    {
        $this->forwardCallback = $callback;
        return $this;
    }

    public function getFieldsToSave(): FieldsToSave
    {
        return $this->request->getFieldsToSave();
    }

    public function getSaveFields(): array
    {
        return $this->getResolveContext2()->getSaveFields();
    }

    public function resolve(): array
    {
        $action = $this->request->getAction();
        $resolveContext = $this->getResolveContext2();

        // if errors

        $actionName = $action->getName();
        $resourceType = $this->request->getResource()::type();
        $mustReturn = "Save callback of mutation resolver for action {$actionName} on resource {$resourceType} must return";

        $model = ($this->saveCallback)();

        if (!$model instanceof ModelInterface) {
            throw new InvalidConfigurationException("{$mustReturn} a ModelInterface object.");
        }

        // save relations

        foreach ($resolveContext->getSaveRelationResolvers() as $saveRelationResolver) {
            $saveRelationResolver
                ->addOwner($model)
                ->resolve();
        }

        // forward if present

        if (isset($this->forwardCallback)) {
            $request = $this->getRequest();
            ($this->forwardCallback)($request, $model);
            return $request->dispatch();
        }

        return [
            'data' => $model,
            'input' => json_decode(file_get_contents('php://input'), true),
            'request' => $this->request
        ];
    }

    protected function getResolveContext2(): MutationResolveContext
    {
        if (!isset($this->resolveContext)) {
            $this->resolveContext = $this->container->create(MutationResolveContext::class)
                ->fieldsToSave($this->request->getFieldsToSave());
        }
        return $this->resolveContext;
    }
}
