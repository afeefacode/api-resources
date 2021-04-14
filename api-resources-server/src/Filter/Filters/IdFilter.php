<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Field\Fields\IdAttribute;
use Afeefa\ApiResources\Filter\Filter;

class IdFilter extends Filter
{
    public static string $type = 'Afeefa.IdFilter';

    protected function setup()
    {
        $this->value(IdAttribute::class);
    }
}
