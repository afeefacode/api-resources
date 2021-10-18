<?php

namespace Afeefa\ApiResources\Tests\Fixtures\SingleTypeApi;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Resource\Resource;

class SingleTypeResource extends Resource
{
    public static string $type = 'Test.SingleTypeResource';

    protected function actions(ActionBag $actions): void
    {
        $singleType = SingleTypeApi::$singleTypeClass;

        $actions->add('single_type_action', function (Action $action) use ($singleType) {
            $action
                ->response($singleType);
        });
    }
}
