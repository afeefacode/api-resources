<?php

namespace Afeefa\ApiResources\Tests\Fixtures\SingleTypeApi;

use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\DI\Container;
use Afeefa\ApiResources\Resource\ResourceBag;

class SingleTypeApi extends Api
{
    public static string $type = 'Test.SingleTypeApi';
    public static string $singleTypeClass;

    public static function create(string $typeClass): SingleTypeApi
    {
        static::$singleTypeClass = $typeClass;

        $container = new Container();
        return $container->create(SingleTypeApi::class);
    }

    protected function resources(ResourceBag $resources): void
    {
        $resources
            ->add(SingleTypeResource::class);
    }
}
