<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Field\Fields\IntAttribute;
use Afeefa\ApiResources\Filter\Filter;

class PageFilter extends Filter
{
    public static string $type = 'Afeefa.PageFilter';

    protected function setup()
    {
        $this->value(function (IntAttribute $page) {
            $page->default(1);
        });
    }
}
