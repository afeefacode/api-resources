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

    public function getDepends(string $root = null): array
    {
        $depends = [];

        $base = $root ? $this->depends[$root] : $this->depends;

        foreach ($base as $field => $nested) {
            if ($nested === true) {
                $depends[] = $field;
            }
        }

        return $depends;
    }
}
