<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Filter\Filter;

class PageFilter extends Filter
{
    public static string $type = 'Afeefa.PageFilter';

    protected $pageSizes = [15];

    protected $default = [
        'page' => 1,
        'page_size' => 15
    ];

    public function pageSizes(array $pageSizes): PageFilter
    {
        $this->pageSizes = $pageSizes;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = parent::toSchemaJson();
        $json['params'] = [
            'page_sizes' => $this->pageSizes
        ];
        return $json;
    }
}
