<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Filter\Filter;

class BooleanFilter extends Filter
{
    public static string $type = 'Afeefa.BooleanFilter';

    protected $values = [true];

    protected $default = false;

    public function values(array $values)
    {
        $this->values = $values;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = parent::toSchemaJson();
        $json['params'] = [
            'values' => $this->values
        ];
        return $json;
    }
}
