<?php

namespace Afeefa\ApiResources\Bag;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;

class Bag implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * @var BagEntryInterface[]
     */
    protected array $entries = [];

    public function remove(string $name): Bag
    {
        unset($this->entries[$name]);
        return $this;
    }

    public function get(string $name): BagEntryInterface
    {
        return $this->entries[$name];
    }

    public function toSchemaJson(): array
    {
        return array_map(function (BagEntryInterface $entry) {
            return $entry->toSchemaJson();
        }, $this->entries);
    }
}
