<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Field\Field;
use Afeefa\ApiResources\Model\ModelInterface;

class BaseFieldResolver extends BaseResolver
{
    /**
     * @var ModelInterface[]
     */
    protected array $owners = [];

    protected Field $field;

    public function field(Field $field): BaseFieldResolver
    {
        $this->field = $field;
        return $this;
    }

    public function addOwner(ModelInterface $owner): BaseFieldResolver
    {
        $this->owners[] = $owner;
        return $this;
    }

    public function addOwners(array $owner): BaseFieldResolver
    {
        $this->owners = $owner;
        return $this;
    }

    /**
     * @return ModelInterface[]
     */
    public function getOwners(): array
    {
        return $this->owners;
    }
}
