<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Api\SchemaVisitor;
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

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $json = parent::toSchemaJson($visitor);
        $json = array_merge($json, $this->values);
        return $json;
    }
}
