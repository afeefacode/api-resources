<?php

namespace Afeefa\ApiResources\Filter\Filters;

use Afeefa\ApiResources\Api\Request;
use Afeefa\ApiResources\Filter\Filter;

class IdFilter extends Filter
{
    public string $type = 'Afeefa.Id';

    public $request;

    public function request(callable $callback): IdFilter
    {
        $request = new Request();
        $callback($request);
        $this->request = $request;
        return $this;
    }
}
