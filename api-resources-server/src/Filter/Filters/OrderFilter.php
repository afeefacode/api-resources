<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Filter\Filter;

class OrderFilter extends Filter
{
    public static string $type = 'Afeefa.OrderFilter';

    public const DESC = 'desc';

    public const ASC = 'asc';

    protected array $fields;

    public function fields(array $fields): OrderFilter
    {
        $this->fields = $fields;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = parent::toSchemaJson();
        $json['params'] = [
            'fields' => $this->fields
        ];
        return $json;
    }
}
