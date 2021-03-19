<?php

namespace Afeefa\ApiResources\Api;

trait ToSchemaJsonTrait
{
    public function toSchemaJson(): array
    {
        if (isset($this->container)) {
            if (method_exists($this, 'getSchemaJson')) {
                return $this->container->callMethod([$this, 'getSchemaJson']);
            }
        }
        return [];
    }
}
