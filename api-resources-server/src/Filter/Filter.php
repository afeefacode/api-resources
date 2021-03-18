<?php

namespace Afeefa\ApiResources\Filter;

use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;

class Filter extends BagEntry
{
    public static string $type;

    protected string $name;

    public function __construct()
    {
        if (!static::$type) {
            throw new MissingTypeException('Missing type for filter of class ' . static::class);
        };
    }

    public function name(string $name): Filter
    {
        $this->name = $name;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = [
            'type' => static::$type
        ];

        return $json;
    }
}
