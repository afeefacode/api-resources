<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Filter\Filter;

class BooleanFilter extends Filter
{
    public string $type = 'Afeefa.Boolean';

    protected $values = [true];

    public function values(array $values)
    {
        $this->values = $values;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = parent::toSchemaJson();
        $json['values'] = $this->values;
        return $json;
    }
}
