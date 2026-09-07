<?php

namespace Afeefa\ApiResources\Eloquent;

use Afeefa\ApiResources\Api\Authorizator;
use Afeefa\ApiResources\Api\NotFoundException;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Resolver\MutationRelationHasManyResolver;
use Afeefa\ApiResources\Resolver\MutationRelationHasOneResolver;
use Afeefa\ApiResources\Resolver\MutationRelationLinkManyResolver;
use Afeefa\ApiResources\Resolver\MutationRelationLinkOneResolver;
use Afeefa\ApiResources\Resolver\QueryRelationResolver;
use Afeefa\ApiResources\V2\Operation;
use Ankurk91\Eloquent\Relations\BelongsToOne;
use Ankurk91\Eloquent\Relations\MorphToOne;
use Error;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\MorphOneOrMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

use Illuminate\Database\Eloquent\Relations\Relation as EloquentRelation;

class ModelRelationResolver
{
    public function get_relation(QueryRelationResolver $r, Authorizator $authorizator)
    {
        $r
            ->ownerIdFields(function () use ($r) {
                // select field on the owner prior loading the relation
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation())->relation();

                if ($eloquentRelation instanceof BelongsTo) { // reference to the related in the owner table
                    $fields = [$eloquentRelation->getForeignKeyName()];
                    if ($eloquentRelation instanceof MorphTo) { // reference to the related in the owner table
                        $fields[] = $eloquentRelation->getMorphType();
                    }
                    return $fields;
                }

                if ($eloquentRelation instanceof HasOneThrough || $eloquentRelation instanceof HasManyThrough) { // reference to the related in the owner table
                    return [$eloquentRelation->getLocalKeyName()];
                }
            })

            ->count(function () {
                // count is resolved using withCount() on the owner
            })

            ->get(function (array $owners) use ($r, $authorizator) {
                $relationWrapper = $this->getEloquentRelationWrapper($r->getRelation());
                $eloquentRelation = $relationWrapper->relation();

                $typeNames = $r->getRelation()->getRelatedType()->getAllTypeNames();

                // if there are more than 1 allowed type, we must have a polymorphic morphTo relation
                // and need to distinguish between the diffent possible related types
                if (count($typeNames) > 1 && $eloquentRelation instanceof MorphTo) {
                    $ownersByRelatedType = $this->sortOwnersByRelatedType($owners, $eloquentRelation->getMorphType());
                } else {
                    $ownersByRelatedType = [$typeNames[0] => $owners];
                }

                $relatedModels = [];

                foreach ($typeNames as $typeName) {
                    if (!array_key_exists($typeName, $ownersByRelatedType)) { // type is allowed but no owner of that type found
                        continue;
                    }
                    $ownersOfRelatedType = $ownersByRelatedType[$typeName];

                    // select field on the relation prior matching the related to its owner
                    $selectFields = $r->getSelectFields($typeName);

                    if ($eloquentRelation instanceof HasOneOrMany) { // reference to the owner in the related table
                        $selectFields[] = $eloquentRelation->getForeignKeyName();
                        if ($eloquentRelation instanceof MorphOneOrMany) { // polymorphic type
                            $selectFields[] = $eloquentRelation->getMorphType();
                        }
                    }

                    $relationCounts = $this->getRelationCountsOfRelation($r, $typeName, $authorizator);

                    $builder = new Builder($relationWrapper->owner);

                    $relatedModels = [
                        ...$relatedModels,
                        ...$builder->afeefaEagerLoadRelation(
                            $ownersOfRelatedType,
                            $relationWrapper->name,
                            $selectFields,
                            $relationCounts,
                            $r->getParams(),
                            function (EloquentRelation $relation) use ($authorizator, $typeName) {
                                $authorizator->applyAuthorizeForTypeName(
                                    $typeName,
                                    Operation::READ,
                                    new EloquentAuthContext($relation)
                                );
                            }
                        )
                    ];
                }

                return $relatedModels;
            });
    }

    public function save_has_one_relation(MutationRelationHasOneResolver $r, Authorizator $authorizator)
    {
        $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation())->relation();

        if ($eloquentRelation instanceof HasOneOrMany) { // reference to the owner in the related table
            $r
                ->saveOwnerToRelated(function (string $id, string $typeName) use ($eloquentRelation) {
                    $ownerKeyName = $eloquentRelation->getLocalKeyName(); // usually id
                    if ($ownerKeyName !== 'id') {
                        $OwnerClass = EloquentRelation::morphMap()[$typeName];
                        $id = $OwnerClass::find($id)->$ownerKeyName;
                    }
                    $ownerFields = [$eloquentRelation->getForeignKeyName() => $id]; // owner_id
                    if ($eloquentRelation instanceof MorphOneOrMany) {
                        $ownerFields[$eloquentRelation->getMorphType()] = $typeName; // owner_type
                    }
                    return $ownerFields;
                });
        }

        if ($eloquentRelation instanceof BelongsTo) { // reference to the related in the owner table
            $r
                ->saveRelatedToOwner(function (?string $id) use ($eloquentRelation) {
                    return [$eloquentRelation->getForeignKeyName() => $id];
                })
                ->addBeforeOwner(function (string $typeName, array $saveFields) use ($r, $authorizator) {
                    $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation())->relation();
                    $relatedModel = $eloquentRelation->getRelated();
                    if (!empty($saveFields)) {
                        $relatedModel->fillable(array_keys($saveFields));
                        $relatedModel->fill($saveFields);
                    }
                    $relatedModel->save();
                    $relatedModel = $relatedModel->fresh();
                    $this->assertModelAuthorized($authorizator, $relatedModel, Operation::CREATE);
                    return $relatedModel;
                });
        }

        $r
            ->get(function (Model $owner) use ($r, $authorizator) {
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation(), $owner)->relation();
                $this->authorizeRelationQuery($authorizator, $r->getRelation(), $eloquentRelation);
                return $eloquentRelation->get()->first();
            })
            ->add(function (Model $owner, string $typeName, array $saveFields) use ($r, $authorizator) {
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation(), $owner)->relation();
                $relatedModel = $eloquentRelation->getRelated();
                if (!empty($saveFields)) {
                    $relatedModel->fillable(array_keys($saveFields));
                    $relatedModel->fill($saveFields);
                }
                $relatedModel->save();
                $relatedModel = $relatedModel->fresh();
                $this->assertModelAuthorized($authorizator, $relatedModel, Operation::CREATE);
                return $relatedModel;
            })
            ->update(function (Model $owner, Model $modelToUpdate, array $saveFields) use ($r, $authorizator) {
                if (!empty($saveFields)) {
                    $modelToUpdate->fillable(array_keys($saveFields));
                    $modelToUpdate->fill($saveFields);
                    $modelToUpdate->save();
                }
                $this->assertModelAuthorized($authorizator, $modelToUpdate, Operation::UPDATE);
            })
            ->delete(function (Model $owner, Model $modelToDelete) use ($r, $authorizator) {
                $this->assertModelAuthorized($authorizator, $modelToDelete, Operation::DELETE);
                $modelToDelete->delete();
            });
    }

    public function save_has_many_relation(MutationRelationHasManyResolver $r, Authorizator $authorizator)
    {
        $r
            ->saveOwnerToRelated(function (string $id, string $typeName) use ($r) {
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation())->relation();

                if ($eloquentRelation instanceof HasOneOrMany) { // reference to the owner in the related table
                    $ownerKeyName = $eloquentRelation->getLocalKeyName(); // usually id
                    if ($ownerKeyName !== 'id') {
                        $OwnerClass = EloquentRelation::morphMap()[$typeName];
                        $id = $OwnerClass::find($id)->$ownerKeyName;
                    }
                    $ownerFields = [$eloquentRelation->getForeignKeyName() => $id]; // owner_id
                    if ($eloquentRelation instanceof MorphOneOrMany) {
                        $ownerFields[$eloquentRelation->getMorphType()] = $typeName; // owner_type
                    }
                    return $ownerFields;
                }
            })
            ->get(function (Model $owner) use ($r, $authorizator) {
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation(), $owner)->relation();
                $this->authorizeRelationQuery($authorizator, $r->getRelation(), $eloquentRelation);
                return $eloquentRelation->get()->all();
            })
            ->add(function (Model $owner, string $typeName, array $saveFields) use ($r, $authorizator) {
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation(), $owner)->relation();
                $relatedModel = $eloquentRelation->getRelated();
                if (!empty($saveFields)) {
                    $relatedModel->fillable(array_keys($saveFields));
                    $relatedModel->fill($saveFields);
                }
                $relatedModel->save();
                $relatedModel = $relatedModel->fresh();
                $this->assertModelAuthorized($authorizator, $relatedModel, Operation::CREATE);
                return $relatedModel;
            })
            ->update(function (Model $owner, Model $modelToUpdate, array $saveFields) use ($r, $authorizator) {
                if (!empty($saveFields)) {
                    $modelToUpdate->fillable(array_keys($saveFields));
                    $modelToUpdate->fill($saveFields);
                    $modelToUpdate->save();
                }
                $this->assertModelAuthorized($authorizator, $modelToUpdate, Operation::UPDATE);
            })
            ->delete(function (Model $owner, Model $modelToDelete) use ($r, $authorizator) {
                $this->assertModelAuthorized($authorizator, $modelToDelete, Operation::DELETE);
                $modelToDelete->delete();
            });
    }

    public function save_link_one_relation(MutationRelationLinkOneResolver $r, Authorizator $authorizator)
    {
        $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation())->relation();

        if ($eloquentRelation instanceof BelongsTo) { // reference to the related in the owner table
            $r
                ->saveRelatedToOwner(function (?string $id, ?string $typeName) use ($r) {
                    $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation())->relation();
                    if ($eloquentRelation instanceof BelongsTo) { // reference to the related in the owner table
                        $fields = [$eloquentRelation->getForeignKeyName() => $id];
                        if ($eloquentRelation instanceof MorphTo) { // reference to the related in the owner table
                            $fields[$eloquentRelation->getMorphType()] = $typeName;
                        }
                        return $fields;
                    }
                });
        }

        $r
            ->get(function (Model $owner) use ($r, $authorizator) {
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation(), $owner)->relation();
                // A link the read rule does not reach does not show up here and
                // is therefore not unlinked either.
                $this->authorizeRelationQuery($authorizator, $r->getRelation(), $eloquentRelation);
                return $eloquentRelation->first();
            })
            ->exists(function (string $id, string $typeName) use ($r, $authorizator) {
                $RelatedClass = EloquentRelation::getMorphedModel($typeName);
                return $this->assertLinkTargetExists($authorizator, $RelatedClass, $typeName, $id);
            })
            ->link(function (Model $owner, string $id, string $typeName) use ($r) {
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation(), $owner)->relation();
                $relatedModel = $eloquentRelation->getRelated()::find($id);
                $eloquentRelation->save($relatedModel); // MorphToOne + HasOne
            })
            ->unlink(function (Model $owner, Model $modelToUnlink) use ($r, $authorizator) {
                $this->assertDetachAuthorized($authorizator, $r->getRelation(), $owner);

                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation(), $owner)->relation();

                if ($eloquentRelation instanceof MorphToOne || $eloquentRelation instanceof BelongsToOne) {
                    $eloquentRelation->detach($modelToUnlink);
                } elseif ($eloquentRelation instanceof HasOne) {
                    $modelToUnlink[$eloquentRelation->getForeignKeyName()] = null;
                    $modelToUnlink->save();
                } else {
                    throw new Error('Not implemented.');
                }
            });
    }

    public function save_link_many_relation(MutationRelationLinkManyResolver $r, Authorizator $authorizator)
    {
        $r
            ->get(function (Model $owner) use ($r, $authorizator) {
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation(), $owner)->relation();
                // A link the read rule does not reach does not show up here and
                // is therefore not unlinked either.
                $this->authorizeRelationQuery($authorizator, $r->getRelation(), $eloquentRelation);
                return $eloquentRelation->get()->all();
            })
            ->exists(function (string $id, string $typeName) use ($r, $authorizator) {
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation())->relation();
                $RelatedClass = $eloquentRelation->getRelated()::class;
                return $this->assertLinkTargetExists($authorizator, $RelatedClass, $typeName, $id);
            })
            ->link(function (Model $owner, string $id, string $typeName) use ($r) {
                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation(), $owner)->relation();
                $relatedModel = $eloquentRelation->getRelated()::find($id);
                $eloquentRelation->attach($relatedModel);
            })
            ->unlink(function (Model $owner, Model $modelToUnlink) use ($r, $authorizator) {
                $this->assertDetachAuthorized($authorizator, $r->getRelation(), $owner);

                $eloquentRelation = $this->getEloquentRelationWrapper($r->getRelation(), $owner)->relation();
                $eloquentRelation->detach($modelToUnlink);
            });
    }

    /**
     * Adds the read rule of the relation target to a relation query.
     *
     * Skipped as soon as more than one target type is possible: which rule
     * applies is only known once the rows are loaded, and there is no single
     * query to hang it on.
     */
    protected function authorizeRelationQuery(?Authorizator $authorizator, Relation $relation, EloquentRelation $eloquentRelation): void
    {
        if (!$authorizator) {
            return;
        }

        $typeNames = $relation->getRelatedType()->getAllTypeNames();
        if (count($typeNames) !== 1) {
            return;
        }

        $authorizator->applyAuthorizeForTypeName(
            $typeNames[0],
            Operation::READ,
            new EloquentAuthContext($eloquentRelation)
        );
    }

    /**
     * Checks a single model against the rule of the given operation.
     *
     * Used as a post state check after a nested save and as a pre state check
     * before a nested delete. Without a registered rule nothing is queried.
     */
    protected function assertModelAuthorized(?Authorizator $authorizator, Model $model, Operation $operation): void
    {
        if (!$authorizator || !$model instanceof ModelInterface) {
            return;
        }

        $typeName = $model->apiResourcesGetType();
        if (!$authorizator->hasAuthorize($typeName, $operation)) {
            return;
        }

        $query = $model->newQuery();
        $authorizator->applyAuthorizeForTypeName($typeName, $operation, new EloquentAuthContext($query));

        if (!$query->whereKey($model->getKey())->exists()) {
            throw new NotFoundException('Model not found');
        }
    }

    /**
     * Detaching changes the owner, not the target: only the link is dropped,
     * the row stays. So the update rule of the owner type decides, not the
     * delete rule of the target - "role X may not delete counselors" does not
     * forbid taking a counselor off a client.
     */
    protected function assertDetachAuthorized(?Authorizator $authorizator, Relation $relation, Model $owner): void
    {
        $ownerType = $relation->getOwner();
        if (!$authorizator || !$ownerType) {
            return;
        }

        $typeName = $ownerType::type();
        if (!$authorizator->hasAuthorize($typeName, Operation::UPDATE)) {
            return;
        }

        $query = $owner->newQuery();
        $authorizator->applyAuthorizeForTypeName($typeName, Operation::UPDATE, new EloquentAuthContext($query));

        if (!$query->whereKey($owner->getKey())->exists()) {
            throw new NotFoundException('Model not found');
        }
    }

    /**
     * Gate in front of linking a target by id.
     *
     * A missing row and a row out of scope have to behave the same, otherwise a
     * client could tell blocked rows apart from non existing ones and probe for
     * their existence. Both throw, instead of skipping the link silently: a
     * silent skip answers "saved" for a state that is not in the database.
     */
    protected function assertLinkTargetExists(?Authorizator $authorizator, string $RelatedClass, string $typeName, string $id): bool
    {
        $query = $RelatedClass::query();

        $authorizator?->applyAuthorizeForTypeName(
            $typeName,
            Operation::READ,
            new EloquentAuthContext($query)
        );

        if (!$query->whereKey($id)->exists()) {
            throw new NotFoundException('Model not found');
        }

        return true;
    }

    protected function getRelationCountsOfRelation(QueryRelationResolver $r, string $typeName, ?Authorizator $authorizator = null): array
    {
        $requestedFieldNames = $r->getRequestedFieldNames($typeName);
        $relatedType = $r->getRelation()->getRelatedType()->getTypeInstance($typeName);
        $relationCounts = [];
        foreach ($requestedFieldNames as $fieldName) {
            if (preg_match('/^count_(.+)/', $fieldName, $matches)) {
                $countRelationName = $matches[1];
                if ($relatedType->hasRelation($countRelationName)) {
                    $relation = $relatedType->getRelation($countRelationName);
                    $isEloquentRelationResolver = $relation->getResolveParam('is_eloquent_relation');
                    if ($isEloquentRelationResolver) {
                        $alias = $countRelationName . ' as count_' . $countRelationName;
                        $relationCounts[$alias] = RelationCountAuthorizer::constraint($authorizator, $relation);
                    }
                }
            }
        }
        return $relationCounts;
    }

    protected function getEloquentRelationWrapper(Relation $relation, ?Model $owner = null): EloquentRelationWrapper
    {
        $eloquentRelation = new EloquentRelationWrapper();

        $eloquentRelation->name = $relation->hasResolveParam('eloquent_relation')
            ? $relation->getResolveParam('eloquent_relation')
            : $relation->getName();

        if (!$owner) {
            /** @var ModelType */
            $ownerType = $relation->getOwner();
            $OwnerClass = $ownerType::$ModelClass;
            $owner = new $OwnerClass();
        }

        $eloquentRelation->owner = $owner;

        return $eloquentRelation;
    }

    /**
     * @param ModelInterface[] $owners
     */
    protected function sortOwnersByRelatedType(array $owners, string $typeField): array
    {
        $ownersByRelatedType = [];
        foreach ($owners as $owner) {
            $typeInDb = $owner->$typeField; // SPRINT.Institution or also Kollektiv\\Account

            if (!$typeInDb) { // no related model for that relation, skip
                continue;
            }

            // handle legacy type e.g. "Kollektiv\\Account" which may be stored in the database
            // but is not supported as a valid type in the API, so we need to convert it into the
            // type of the actual related model
            $RelatedModel = EloquentRelation::getMorphedModel($typeInDb);
            $type = $RelatedModel::$type;
            $ownersByRelatedType[$type][] = $owner;
        }
        return $ownersByRelatedType;
    }
}

class EloquentRelationWrapper
{
    public Model $owner;
    public string $name;

    public function relation(): EloquentRelation
    {
        return $this->owner->{$this->name}();
    }
}
