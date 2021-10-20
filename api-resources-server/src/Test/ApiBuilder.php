<?php

namespace Afeefa\ApiResources\Test;

use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\DI\Container;
use Afeefa\ApiResources\Resource\Resource;
use Afeefa\ApiResources\Resource\ResourceBag;
use Closure;

class ApiBuilder
{
    public Container $container;
    public Api $api;

    public function api(string $type, ?Closure $resourcesCallback = null): ApiBuilder
    {
        $this->container = new Container();

        $api = new class() extends Api {
            public static ?Closure $resourcesCallback;

            protected function resources(ResourceBag $resources): void
            {
                if (static::$resourcesCallback) {
                    (static::$resourcesCallback)->call($this, $resources);
                }
            }
        };

        $ApiClass = get_class($api);
        $ApiClass::$type = $type;

        $ApiClass::$resourcesCallback = $resourcesCallback;

        $this->api = $this->container->create($ApiClass);

        return $this;
    }

    public function get(): Api
    {
        return $this->api;
    }
}
