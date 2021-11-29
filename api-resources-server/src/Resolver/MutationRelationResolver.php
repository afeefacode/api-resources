<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Api\FieldsToSave;
use Afeefa\ApiResources\DB\RelationRelatedData;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackException;
use Afeefa\ApiResources\Model\ModelInterface;
use Closure;

/**
 * @method MutationRelationResolver ownerType(Type $ownerType)
 * @method MutationRelationResolver relation(Relation $relation)
 * @method MutationRelationResolver addOwner(ModelInterface $owner)
 */
class MutationRelationResolver extends BaseRelationResolver
{
    protected FieldsToSave $fieldsToSave;

    protected MutationResolveContext $resolveContext;

    protected ?Closure $setCallback = null;

    protected ?Closure $updateCallback = null;

    protected ?Closure $addCallback = null;

    protected ?Closure $deleteCallback = null;

    public function fieldsToSave(FieldsToSave $fieldsToSave): MutationRelationResolver
    {
        $this->fieldsToSave = $fieldsToSave;
        return $this;
    }

    public function getSaveFields(): array
    {
        return $this->getResolveContext()->getSaveFields();
    }

    public function set(Closure $callback): MutationRelationResolver
    {
        $this->setCallback = $callback;
        return $this;
    }

    public function update(Closure $callback): MutationRelationResolver
    {
        $this->updateCallback = $callback;
        return $this;
    }

    public function add(Closure $callback): MutationRelationResolver
    {
        $this->addCallback = $callback;
        return $this;
    }

    public function delete(Closure $callback): MutationRelationResolver
    {
        $this->deleteCallback = $callback;
        return $this;
    }

    public function resolve(): void
    {
        $fieldsToSave = $this->fieldsToSave;

        $relation = $this->getRelation();
        $callback = null;

        if ($relation->shallUpdateItems()) {
            $callback = $this->updateCallback;
            if (!$callback) {
                throw new MissingCallbackException('save resolve callback needs to implement a update() method.');
            }
        } elseif ($relation->shallAddItems()) {
            $callback = $this->addCallback;
            if (!$callback) {
                throw new MissingCallbackException('save resolve callback needs to implement a add() method.');
            }
        } elseif ($relation->shallDeleteItems()) {
            $callback = $this->deleteCallback;
            if (!$callback) {
                throw new MissingCallbackException('save resolve callback needs to implement a delete() method.');
            }
        } else { // set items
            $callback = $this->setCallback;
            if (!$callback) {
                throw new MissingCallbackException('save resolve callback needs to implement a set() method.');
            }
        }

        if ($relation->isSingle()) {
        } else {
            $relatedObjects = [];

            foreach ($fieldsToSave as $singleFieldsToSave) {
                $relatedObject = new RelationRelatedData();
                $relatedObject->resolveContext = $this->getResolveContext();

                if ($relation->shallAddItems()) {
                    $relatedObject->updates = $relatedObject->resolveContext->getSaveFields();
                } elseif ($relation->shallDeleteItems()) {
                    $relatedObject->id = $singleFieldsToSave->getId();
                    $relatedObject->saved = false; // do not resolve sub relations
                } else { // set or update
                    $relatedObject->id = $singleFieldsToSave->getId();
                    $relatedObject->updates = $relatedObject->resolveContext->getSaveFields();
                }

                $relatedObjects[] = $relatedObject;
            }

            $owner = $this->getOwners()[0];

            $callback($owner, $relatedObjects);

            // save relations of related
            // TODO this needs to be tested
            foreach ($relatedObjects as $relatedObject) {
                if ($relatedObject->saved) {
                    foreach ($relatedObject->resolveContext->getSaveRelationResolvers() as $saveRelationResolver) {
                        $saveRelationResolver->resolve();
                    }
                }
            }
        }
    }

    protected function getResolveContext(): MutationResolveContext
    {
        if (!isset($this->resolveContext)) {
            $this->resolveContext = $this->container->create(MutationResolveContext::class)
                ->fieldsToSave($this->fieldsToSave);
        }
        return $this->resolveContext;
    }
}
