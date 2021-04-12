<?php

namespace Afeefa\ApiResources\Filter;

use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;

class Filter extends BagEntry
{
    public static string $type;

    protected string $name;

    protected $default;

    protected $params;

    public function created(): void
    {
        if (!static::$type) {
            throw new MissingTypeException('Missing type for filter of class ' . static::class . '.');
        };
    }

    public function name(string $name): Filter
    {
        $this->name = $name;
        return $this;
    }

    public function default($default): Filter
    {
        $this->default = $default;
        return $this;
    }

    public function params($params): Filter
    {
        $this->params = $params;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = [
            'type' => static::$type,
            'default' => $this->default
        ];

        return $json;
    }
}
