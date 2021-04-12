<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Filter\Filter;
use Closure;

class IdFilter extends Filter
{
    public static string $type = 'Afeefa.IdFilter';

    protected ApiRequest $request;

    public function request(Closure $callback): IdFilter
    {
        $request = new ApiRequest();
        $callback($request);
        $this->request = $request;
        return $this;
    }
}
