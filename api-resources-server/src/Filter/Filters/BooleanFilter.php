<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Filter\Filter;

class BooleanFilter extends Filter
{
    public string $type = 'Afeefa.Boolean';

    public $values = [true];

    public function values(array $values)
    {
        $this->values = $values;
        return $this;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $json = parent::toSchemaJson($visitor);
        $json['values'] = $this->values;
        return $json;
    }
}
