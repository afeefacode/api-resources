<?php

namespace Afeefa\ApiResources\Bag;

use Afeefa\ApiResources\DI\ContainerAwareTrait;

class BagEntry implements BagEntryInterface
{
    use ContainerAwareTrait;

    public function toSchemaJson(): array
    {
        return [];
    }
}
