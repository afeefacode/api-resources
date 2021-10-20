<?php

namespace Afeefa\ApiResources\Test;

use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Resource\Resource;
use Closure;

class ResourceBuilder
{
    public Resource $resource;

    public function resource(
        string $typeName,
        ?Closure $actionsCallback = null): ResourceBuilder
    {
        $resource = new class extends Resource {
            public static ?Closure $actionsCallback;

            protected function actions(ActionBag $actions): void
            {
                if (static::$actionsCallback) {
                    (static::$actionsCallback)->call($this, $actions);
                }
            }
        };

        $ResourceClass = get_class($resource);
        $ResourceClass::$type = $typeName;

        $ResourceClass::$actionsCallback = $actionsCallback;

        $this->resource = $resource;

        return $this;
    }

    public function get(): Resource
    {
        return $this->resource;
    }
}
