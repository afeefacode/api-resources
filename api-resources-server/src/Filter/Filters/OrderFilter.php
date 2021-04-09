<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Filter\Filter;

class OrderFilter extends Filter
{
    public static string $type = 'Afeefa.Order';

    public const DESC = 'desc';

    public const ASC = 'asc';

    protected array $values;

    public function values(array $values): OrderFilter
    {
        $this->values = $values;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = parent::toSchemaJson();
        $json['fields'] = $this->values;
        return $json;
    }
}
