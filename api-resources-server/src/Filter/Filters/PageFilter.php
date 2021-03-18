<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Filter\Filter;

class PageFilter extends Filter
{
    public string $type = 'Afeefa.Page';

    protected $defaultPageSize;

    protected $pageSizes;

    public function pageSizes(array $pageSizes, int $defaultPageSize): PageFilter
    {
        $this->pageSizes = $pageSizes;
        $this->defaultPageSize = $defaultPageSize;
        return $this;
    }

    public function toSchemaJson(): array
    {
        $json = parent::toSchemaJson();
        $json['default_page_size'] = $this->defaultPageSize;
        $json['page_sizes'] = $this->pageSizes;
        return $json;
    }
}
