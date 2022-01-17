<?php

namespace Afeefa\ApiResources\Resolver\Mutation;

use Afeefa\ApiResources\Resolver\Action\BaseActionResolver;
use Closure;

class BaseMutationActionResolver extends BaseActionResolver
{
    protected MutationResolveContext $resolveContext;

    protected ?Closure $forwardCallback = null;

    protected array $relatedSaveFields = [];

    public function forward(Closure $callback): BaseMutationActionResolver
    {
        $this->forwardCallback = $callback;
        return $this;
    }

    public function resolve(): array
    {
        return [];
    }

    protected function getSaveFields(): array
    {
        return $this->getResolveContext2()->getSaveFields($this->relatedSaveFields);
    }

    protected function getResolveContext2(): MutationResolveContext
    {
        if (!isset($this->resolveContext)) {
            $action = $this->request->getAction();
            $typeName = $action->getInput()->getTypeClass()::type();

            $this->resolveContext = $this->container->create(MutationResolveContext::class)
                ->type($this->getTypeByName($typeName))
                ->fieldsToSave($this->request->getFieldsToSave2());
        }
        return $this->resolveContext;
    }
}
