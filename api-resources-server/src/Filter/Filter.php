<?php

namespace Afeefa\ApiResources\Filter;

use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;
use Afeefa\ApiResources\Field\Attribute;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;

class Filter extends BagEntry
{
    public static string $type;

    protected string $name;

    protected array $options;

    protected Attribute $value;

    public function created(): void
    {
        if (!static::$type) {
            throw new MissingTypeException('Missing type for filter of class ' . static::class . '.');
        };

        $this->setup();

        if (!isset($this->value)) {
            $this->value = $this->container->create(VarcharAttribute::class);
        };

        if (!$this->value->hasDefaultValue()) {
            $this->value->default(null);
        };
    }

    public function name(string $name): Filter
    {
        $this->name = $name;
        return $this;
    }

    public function default($default): Filter
    {
        $this->value->default($default);
        return $this;
    }

    public function getDefaultValue()
    {
        return $this->value->getDefaultValue();
    }

    public function options(array $options)
    {
        $this->options = $options;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = [
            'type' => static::$type,
            'value' => $this->value->toSchemaJson()
        ];

        if (isset($this->options)) {
            $json['options'] = $this->options;
        }

        return $json;
    }

    protected function setup()
    {
    }

    protected function value($classOrCallback): Filter
    {
        $this->container->create($classOrCallback, function (Attribute $attribute) {
            $this->value = $attribute;
        });
        return $this;
    }
}
