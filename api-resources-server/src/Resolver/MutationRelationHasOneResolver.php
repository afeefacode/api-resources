<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Api\Operation;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackException;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Resolver\Mutation\MutationRelationResolver;
use Afeefa\ApiResources\Resolver\Mutation\MutationResolveContext;
use Closure;

class MutationRelationHasOneResolver extends MutationRelationResolver
{
    protected array $relatedSaveFields = [];

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

        $typeName = $relation->getRelatedType()->getAllTypeNames()[0];
        $owner = $this->owners[0] ?? null;

        // A.b_id

        if ($this->saveRelatedToOwnerCallback) {
            if (!$this->addBeforeOwnerCallback) {
                throw new MissingCallbackException("{$needsToImplement} an addBeforeOwner() method.");
            }

            $related = null;

            if ($this->operation === Operation::UPDATE) { // update owner -> handle related
                $related = $this->handleSaveRelatedAndRelations($owner, $typeName, $mustReturn, function ($saveFields) use ($owner, $typeName, $mustReturn) {
                    return $this->handleSaveRelated($owner, $typeName, $mustReturn, $saveFields);
                });
            } else { // create owner -> create related
                if (is_array($this->fieldsToSave)) { // add related only if data present
                    $related = $this->handleSaveRelatedAndRelations($owner, $typeName, $mustReturn, function (array $saveFields) use ($typeName, $mustReturn) {
                        $related = ($this->addBeforeOwnerCallback)($typeName, $saveFields);
                        if ($related !== null && !$related instanceof ModelInterface) {
                            throw new InvalidConfigurationException("AddBeforeOwner {$mustReturn} a ModelInterface object.");
                        }
                        return $related;
                    });
                }
            }

            $this->resolvedId = $related ? $related->apiResourcesGetId() : null;
            $this->resolvedType = $related ? $related->apiResourcesGetType() : null;
            return;
        }

        // B.a_id or C.a_id,b_id

        $related = $this->handleSaveRelatedAndRelations($owner, $typeName, $mustReturn, function ($saveFields) use ($owner, $typeName, $mustReturn) {
            return $this->handleSaveRelated($owner, $typeName, $mustReturn, $saveFields);
        });
    }

    protected function handleSaveRelatedAndRelations(?ModelInterface $owner, string $typeName, string $mustReturn, Closure $handleSavedClosure): ?ModelInterface
    {
        $resolveContext = $this->container->create(MutationResolveContext::class)
            ->type($this->getTypeByName($typeName))
            ->fieldsToSave($this->fieldsToSave);

        if (is_array($this->fieldsToSave)) {
            foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
                if ($relationResolver->shouldSaveRelatedToOwner()) {
                    $relationResolver->operation(Operation::CREATE);
                    $relationResolver->resolve(); // model to save in the owner
                    $this->relatedSaveFields = $relationResolver->getSaveRelatedToOwnerFields();
                }
            }
        }

        $saveFields = array_merge($this->getSaveFields(), $this->relatedSaveFields);

        /** @var ModelInterface */
        $related = $handleSavedClosure($saveFields);

        // save relations of related
        if ($related && is_array($this->fieldsToSave)) {
            foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
                if ($relationResolver->shouldSaveRelatedToOwner()) {
                    continue; // already resolved
                }

                $ownerSaveFields = [];

                // save owner field to related

                if ($relationResolver->shouldSaveOwnerToRelated()) {
                    $ownerSaveFields = $relationResolver->getSaveOwnerToRelatedFields(
                        $related->apiResourcesGetId(),
                        $related->apiResourcesGetType()
                    );
                }

                $existingModel = ($this->getCallback)($owner);
                $operation = $existingModel ? Operation::UPDATE : Operation::CREATE;

                $relationResolver
                    ->operation($operation)
                    ->addOwner($related)
                    ->ownerSaveFields($ownerSaveFields)
                    ->resolve();
            }
        }

        return $related;
    }

    protected function handleSaveRelated(ModelInterface $owner, string $typeName, string $mustReturn, array $saveFields): ?ModelInterface
    {
        if ($this->operation === Operation::UPDATE) {
            /** @var ModelInterface */
            $existingModel = ($this->getCallback)($owner);
            if ($existingModel !== null && !$existingModel instanceof ModelInterface) {
                throw new InvalidConfigurationException("Get {$mustReturn} a ModelInterface object or null.");
            }

            if ($existingModel) {
                if ($this->fieldsToSave === null) { // delete related
                    ($this->deleteCallback)($owner, $existingModel);
                    return null;
                }
                // update related
                ($this->updateCallback)($owner, $existingModel, $saveFields);
                return $existingModel;
            }

            if (is_array($this->fieldsToSave)) {
                // add related
                $addedModel = ($this->addCallback)($owner, $typeName, $saveFields);
                if (!$addedModel instanceof ModelInterface) {
                    throw new InvalidConfigurationException("Add {$mustReturn} a ModelInterface object.");
                }
                return $addedModel;
            }
        } else {
            if (is_array($this->fieldsToSave)) {
                // add related
                $addedModel = ($this->addCallback)($owner, $typeName, $saveFields);
                if (!$addedModel instanceof ModelInterface) {
                    throw new InvalidConfigurationException("Add {$mustReturn} a ModelInterface object.");
                }
                return $addedModel;
            }
        }

        return null;
    }
}
