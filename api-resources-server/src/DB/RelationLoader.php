<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\Model\ModelInterface;
use Closure;

class RelationLoader
{
    protected array $selectFields = [];

    /**
     * @var ModelInterface[]
     */
    protected array $owners = [];

    protected string $ownerKey;

    protected string $relatedKey;

    protected Closure $loadCallback;

    public function selectFields(array $selectFields): RelationLoader
    {
        $this->selectFields = $selectFields;
        return $this;
    }

    public function mapKeys(string $ownerKey, string $relatedKey): RelationLoader
    {
        $this->ownerKey = $ownerKey;
        $this->relatedKey = $relatedKey;
        return $this;
    }

    public function getOwnerKey(): string
    {
        return $this->ownerKey;
    }

    public function getRelatedKey(): string
    {
        return $this->relatedKey;
    }

    public function owner(ModelInterface $owner): void
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

    public function load(Closure $callback): RelationLoader
    {
        $this->loadCallback = $callback;
        return $this;
    }

    public function get()
    {
        $callback = $this->loadCallback;

        $relatedIds = array_unique(
            array_map(function (ModelInterface $owner) {
                return $owner->{$this->ownerKey};
            }, $this->owners)
        );
        sort($relatedIds);

        $models = $callback($relatedIds, $this->selectFields);

        return array_column(
            array_map(
                function (ModelInterface $model) {
                    return [$model->{$this->relatedKey}, $model];
                },
                $models
            ),
            1,
            0
        );
    }
}
