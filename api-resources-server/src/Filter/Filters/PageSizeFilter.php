<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Field\Fields\IntAttribute;
use Afeefa\ApiResources\Filter\Filter;

class PageSizeFilter extends Filter
{
    public static string $type = 'Afeefa.PageSizeFilter';

    public function pageSizes(array $pageSizes): PageSizeFilter
    {
        return parent::options($pageSizes);
    }

    protected function setup()
    {
        $this
            ->options([15])
            ->value(function (IntAttribute $pageSize) {
                $pageSize->default(15);
            });
    }
}
