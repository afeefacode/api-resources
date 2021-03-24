<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Model\ModelInterface;
use Closure;

class RelationResolver extends RelationLoader
{
    protected Relation $relation;

    protected array $requestedFields = [];

    protected ?ModelInterface $owner = null;

    /**
     * @var ModelInterface[]
     */
    protected array $owners = [];

    protected array $ownerIdFields = [];

    protected ?Closure $loadCallback = null;

    protected ?Closure $mapCallback = null;

    public function relation(Relation $relation): RelationResolver
    {
        $this->relation = $relation;
        return $this;
    }

    public function requestedFields(array $requestedFields): RelationResolver
    {
        $this->requestedFields = $requestedFields;
        return $this;
    }

    public function ownerIdFields(array $ownerIdFields): RelationResolver
    {
        $this->ownerIdFields = $ownerIdFields;
        return $this;
    }

    public function getOwnerIdFields(): array
    {
        return $this->ownerIdFields;
    }

    public function addOwner(ModelInterface $owner): void
    {
        $this->owners[] = $owner;
    }

    /**
     * @return ModelInterface[]
     */
    public function getOwners(): array
    {
        return $this->owners;
    }

    public function load(Closure $callback): RelationResolver
    {
        $this->loadCallback = $callback;
        return $this;
    }

    public function map(Closure $callback): RelationResolver
    {
        $this->mapCallback = $callback;
        return $this;
    }

    public function fetch()
    {
        $loadCallback = $this->loadCallback;

        $type = $this->relation->getRelatedTypeInstance();
        $requestedFields = $this->requestedFields;

        $relationResolvers = $this->createRelationResolvers($type, $requestedFields);
        $selectFields = $this->getSelectFields($type, $requestedFields, $relationResolvers);

        $objects = $loadCallback($this->owners, $selectFields);

        $mapCallback = $this->mapCallback;

        $relationName = $this->relation->getName();

        foreach ($this->owners as $owner) {
            $value = $mapCallback($objects, $owner);

            if ($value) {
                $models = $this->relation->isSingle() ? [$value] : $value;
                foreach ($relationResolvers as $requestedField => $relationResolver) {
                    foreach ($models as $model) {
                        $relationResolver->addOwner($model);
                    }
                    $relationResolver->requestedFields($requestedFields[$requestedField]);
                }
            }

            if (!$value) {
                $value = $this->relation->isSingle() ? null : [];
            }

            $owner->apiResourcesSetRelation($relationName, $value);
        }

        foreach ($relationResolvers as $requestedField => $relationResolver) {
            $relationResolver->fetch();
        }
    }
}
