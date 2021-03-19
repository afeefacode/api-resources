<?php

namespace Afeefa\ApiResources\Bag;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Closure;

class Bag implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * @var BagEntryInterface[]
     */
    private array $entries = [];

    public function get(string $name): BagEntryInterface
    {
        return $this->entries[$name];
    }

    public function set(string $name, $value): Bag
    {
        $this->entries[$name] = $value;
        return $this;
    }

    public function has(string $name): bool
    {
        return isset($this->entries[$name]);
    }

    public function remove(string $name): Bag
    {
        unset($this->entries[$name]);
        return $this;
    }

    public function entries(): array
    {
        return $this->entries;
    }

    protected function classOrCallback($classOrCallback): array
    {
        if ($classOrCallback instanceof Closure) {
            return [null, $classOrCallback];
        }
        return [$classOrCallback, null];
    }

    public function toSchemaJson(): array
    {
        return array_map(function (BagEntryInterface $entry) {
            return $entry->toSchemaJson();
        }, $this->entries);
    }
}
