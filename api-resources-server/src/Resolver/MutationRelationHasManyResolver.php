<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Api\Operation;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackException;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Resolver\Mutation\MutationRelationResolver;
use Afeefa\ApiResources\Resolver\Mutation\MutationResolveContext;

class MutationRelationHasManyResolver extends MutationRelationResolver
{
    public function resolve(): void
    {
        $relation = $this->getRelation();
        $relationName = $this->getRelation()->getName();

        $needsToImplement = "Resolver for relation {$relationName} needs to implement";
        $mustReturn = "callback of resolver for relation {$relationName} must return";

        if (!$this->getCallback) {
            throw new MissingCallbackException("{$needsToImplement} a get() method.");
        }

        if (!$this->addCallback) {
            throw new MissingCallbackException("{$needsToImplement} an add() method.");
        }

        if (!$this->updateCallback) {
            throw new MissingCallbackException("{$needsToImplement} an update() method.");
        }

        if (!$this->deleteCallback) {
            throw new MissingCallbackException("{$needsToImplement} a delete() method.");
        }

        $owner = $this->owners[0];
        $typeName = $relation->getRelatedType()->getAllTypeNames()[0];
        $data = $this->fieldsToSave;

        if ($this->operation === Operation::UPDATE) {
            $existingModels = ($this->getCallback)($owner);
            if (!is_array($existingModels)) {
                throw new InvalidConfigurationException("Get {$mustReturn} an array of ModelInterface objects.");
            }
            foreach ($existingModels as $existingModel) {
                if (!$existingModel instanceof ModelInterface) {
                    throw new InvalidConfigurationException("Get {$mustReturn} an array of ModelInterface objects.");
                }
            }

            $getExistingModelById = fn ($id) => array_values(array_filter($existingModels, fn ($m) => $m->apiResourcesGetId() === $id))[0] ?? null;
            $getSavedDataById = fn ($id) => array_values(array_filter($data, fn ($single) => ($single['id'] ?? null) === $id))[0] ?? null;

            foreach ($existingModels as $existingModel) {
                $id = $existingModel->apiResourcesGetId();
                if (!$getSavedDataById($id)) {
                    ($this->deleteCallback)($owner, $existingModel);
                }
            }

            foreach ($data as $single) {
                $resolveContext = $this->container->create(MutationResolveContext::class)
                    ->type($this->getTypeByName($typeName))
                    ->fieldsToSave($single);

                $existingModel = $getExistingModelById($single['id'] ?? null);
                if ($existingModel) {
                    ($this->updateCallback)($owner, $existingModel, $resolveContext->getSaveFields());
                } else {
                    $addedModel = ($this->addCallback)($owner, $typeName, $resolveContext->getSaveFields());
                    if (!$addedModel instanceof ModelInterface) {
                        throw new InvalidConfigurationException("Add {$mustReturn} a ModelInterface object.");
                    }
                }
            }
        } else { // create, only add
            foreach ($data as $single) {
                if (is_array($single)) {
                    $resolveContext = $this->container->create(MutationResolveContext::class)
                        ->type($this->getTypeByName($typeName))
                        ->fieldsToSave($single);

                    $addedModel = ($this->addCallback)($owner, $typeName, $resolveContext->getSaveFields());
                    if (!$addedModel instanceof ModelInterface) {
                        throw new InvalidConfigurationException("Add {$mustReturn} a ModelInterface object.");
                    }
                }
            }
        }
    }
}
