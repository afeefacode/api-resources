<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Api\Request;
use Afeefa\ApiResources\Filter\Filter;
use Closure;

class IdFilter extends Filter
{
    public static string $type = 'Afeefa.Id';

    protected Request $request;

    public function request(Closure $callback): IdFilter
    {
        $request = new Request();
        $callback($request);
        $this->request = $request;
        return $this;
    }
}
