<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Filter\Filter;

class OrderFilter extends Filter
{
    public string $type = 'Afeefa.Order';

    public array $values;

    public function values(array $values): OrderFilter
    {
        $this->values = $values;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = parent::toSchemaJson();
        $json = array_merge($json, $this->values);
        return $json;
    }
}
