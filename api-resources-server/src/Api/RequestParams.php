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
        foreach ($this->depends as $field) {
            if ($root) {
                if (is_array($field)) {
                    foreach ($field as $subField => $subFields) {
                        if ($subField === $root) {
                            $depends = $subFields;
                        }
                    }
                }
            } else {
                if (is_string($field)) {
                    $depends[] = $field;
                }
            }
        }
        return $depends;
    }
}
