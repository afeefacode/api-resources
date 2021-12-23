<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Model\ModelInterface;
use Closure;

/**
 * @method MutationActionResolver addOwner($owner)
 */
class MutationActionResolver extends BaseActionResolver
{
    protected MutationResolveContext $resolveContext;

    protected ?Closure $getCallback = null;

    protected ?Closure $saveCallback = null;

    protected ?Closure $forwardCallback = null;

    protected array $relatedSaveFields = [];

    public function get(Closure $callback): MutationActionResolver
    {
        $this->getCallback = $callback;
        return $this;
    }

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

    public function getSaveFields(): array
    {
        return $this->getResolveContext2()->getSaveFields($this->relatedSaveFields);
    }

    public function resolve(): array
    {
        $action = $this->request->getAction();
        $resolveContext = $this->getResolveContext2();

        // if errors

        $actionName = $action->getName();
        $resourceType = $this->request->getResource()::type();
        $mustReturn = "callback of mutation resolver for action {$actionName} on resource {$resourceType} must return";

        // get model (if update)

        /** @var ModelInterface */
        $model = null;

        $fieldsToSave = $this->request->getFieldsToSave2();
        $id = $fieldsToSave['id'] ?? null;

        $input = $action->getInput();

        if ($input->isUnion() && !isset($fieldsToSave['type'])) {
            throw new InvalidConfigurationException('Must specify a type in the payload of the union action {$actionName} on resource {$resourceType}');
        };

        $typeName = $input->isUnion() ? $fieldsToSave['type'] : $input->getTypeClass()::type();

        if ($id) {
            $model = ($this->getCallback)($id, $typeName);
            if (!$model) {
                throw new InvalidConfigurationException("Get {$mustReturn} a ModelInterface object.");
            }
        }

        // save relations before owner (only has one possible)

        foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
            $relatedFields = $relationResolver->shouldBeResolvedBeforeOwner();
            if ($relatedFields) {
                if ($model) { // update, owner exists
                    $relationResolver->addOwner($model);
                }

                /** @var ModelInterface */
                $related = $relationResolver->resolve();

                $this->relatedSaveFields[$relatedFields['id']] = $related ? $related->apiResourcesGetId() : null;
                if (isset($relatedFields['type'])) {
                    $this->relatedSaveFields[$relatedFields['type']] = $related ? $related->apiResourcesGetType() : null;
                }
            }
        }

        // save model

        $model = ($this->saveCallback)();
        if (!$model instanceof ModelInterface) {
            throw new InvalidConfigurationException("Save {$mustReturn} a ModelInterface object.");
        }

        // save relations after owner

        foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
            if ($relationResolver->shouldBeResolvedBeforeOwner()) {
                continue; // already resolved
            }

            $ownerSaveFields = [];
            $relatedOwnerFields = $relationResolver->shouldBeResolvedAfterOwner();
            if ($relatedOwnerFields) {
                $ownerSaveFields[$relatedOwnerFields['id']] = $model->apiResourcesGetId();
                if (isset($relatedOwnerFields['type'])) {
                    $ownerSaveFields[$relatedOwnerFields['type']] = $model->apiResourcesGetType();
                }
            }

            $relationResolver
                ->addOwner($model)
                ->ownerSaveFields($ownerSaveFields)
                ->resolve();
        }

        // forward if present

        if ($this->forwardCallback) {
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
            $action = $this->request->getAction();
            $typeName = $action->getInput()->getTypeClass()::type();

            $this->resolveContext = $this->container->create(MutationResolveContext::class)
                ->type($this->getTypeByName($typeName))
                ->fieldsToSave($this->request->getFieldsToSave2());
        }
        return $this->resolveContext;
    }
}
