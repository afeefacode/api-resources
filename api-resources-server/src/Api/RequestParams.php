<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\Bag\Bag;

class RequestParams extends Bag
{
    protected array $depends = [];

    public function depends(array $depends): RequestParams
    {
        $this->depends = $depends;
        return $this;
    }

    public function getDepends(): array
    {
        return $this->depends;
    }
}
