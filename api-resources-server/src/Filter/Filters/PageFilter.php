<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Filter\Filter;

class PageFilter extends Filter
{
    public string $type = 'Afeefa.Page';

    public $defaultPageSize;
    public $pageSizes;

    public function pageSizes(array $pageSizes, int $defaultPageSize): PageFilter
    {
        $this->pageSizes = $pageSizes;
        $this->defaultPageSize = $defaultPageSize;
        return $this;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $json = parent::toSchemaJson($visitor);
        $json['default_page_size'] = $this->defaultPageSize;
        $json['page_sizes'] = $this->pageSizes;
        return $json;
    }
}
