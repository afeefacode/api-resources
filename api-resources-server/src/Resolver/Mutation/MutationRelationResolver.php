<?php

namespace Afeefa\ApiResources\Resolver\Mutation;

use Afeefa\ApiResources\Resolver\Field\BaseFieldResolver;
use Afeefa\ApiResources\Resolver\Field\RelationResolverTrait;
use Closure;

/**
 * @method MutationRelationResolver ownerIdFields($ownerIdFields)
 * @method MutationRelationResolver addOwner($owner)
 * @method MutationRelationResolver relation(Relation $relation)
 */
class MutationRelationResolver extends BaseFieldResolver
{
    use MutationResolverTrait;
    use RelationResolverTrait;

    /**
     * array or null
     */
    protected ?array $fieldsToSave;

    protected MutationResolveContext $resolveContext;

    protected ?Closure $saveRelatedToOwnerCallback = null;

    protected ?Closure $resolveAfterOwnerCallback = null;

    protected array $ownerSaveFields = [];

    protected ?Closure $getCallback = null;

    protected ?Closure $updateCallback = null;

    protected ?Closure $addBeforeOwnerCallback = null;

    protected ?Closure $addCallback = null;

    protected ?Closure $deleteCallback = null;

    protected ?Closure $linkCallback = null;

    protected ?Closure $unlinkCallback = null;

    protected ?string $operation = null;

    protected ?string $resolvedId = null;

    protected ?string $resolvedType = null;

    /**
     * fieldsToSave can be null
     */
    public function fieldsToSave(?array $fieldsToSave): self
    {
        $this->fieldsToSave = $fieldsToSave;
        return $this;
    }

    public function ownerSaveFields(array $ownerSaveFields): self
    {
        $this->ownerSaveFields = $ownerSaveFields;
        return $this;
    }

    public function getSaveFields(): array
    {
        return $this->getResolveContext2()->getSaveFields($this->ownerSaveFields);
    }

    public function saveRelatedToOwner(Closure $callback): self
    {
        $this->saveRelatedToOwnerCallback = $callback;
        return $this;
    }

    public function shouldSaveRelatedToOwner(): bool
    {
        return !!$this->saveRelatedToOwnerCallback;
    }

    public function getSaveRelatedToOwnerFields(): array
    {
        return ($this->saveRelatedToOwnerCallback)($this->resolvedId, $this->resolvedType);
    }

    public function saveOwnerToRelated(Closure $callback): self
    {
        $this->resolveAfterOwnerCallback = $callback;
        return $this;
    }

    public function shouldSaveOwnerToRelated(): bool
    {
        return !!$this->resolveAfterOwnerCallback;
    }

    public function getSaveOwnerToRelatedFields(?string $id, ?string $typeName): array
    {
        return ($this->resolveAfterOwnerCallback)($id, $typeName);
    }

    public function operation(string $operation): self
    {
        $this->operation = $operation;
        return $this;
    }

    public function get(Closure $callback): self
    {
        $this->getCallback = $callback;
        return $this;
    }

    public function update(Closure $callback): self
    {
        $this->updateCallback = $callback;
        return $this;
    }

    public function addBeforeOwner(Closure $callback): self
    {
        $this->addBeforeOwnerCallback = $callback;
        return $this;
    }

    public function add(Closure $callback): self
    {
        $this->addCallback = $callback;
        return $this;
    }

    public function delete(Closure $callback): self
    {
        $this->deleteCallback = $callback;
        return $this;
    }

    public function link(Closure $callback): self
    {
        $this->linkCallback = $callback;
        return $this;
    }

    public function unlink(Closure $callback): self
    {
        $this->unlinkCallback = $callback;
        return $this;
    }

    public function resolve(): void
    {
    }

    protected function getResolveContext2(): MutationResolveContext
    {
        if (!isset($this->resolveContext)) {
            $owner = $this->owners[0] ?? null;
            $typeName = $this->getRelation()->getRelatedType()->getTypeClass()::type();

            $this->resolveContext = $this->container->create(MutationResolveContext::class)
                ->owner($owner)
                ->type($this->getTypeByName($typeName))
                ->fieldsToSave($this->fieldsToSave);
        }
        return $this->resolveContext;
    }
}
