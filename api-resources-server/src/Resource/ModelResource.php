<?php

namespace Afeefa\ApiResources\Resource;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Action\ActionResponse;

class ModelResource extends Resource
{
    protected string $ModelType;

    public function actions(ActionBag $actions): void
    {
        $actions->add('list', function (Action $action) {
            $action->response(function (ActionResponse $response) {
                $response->type($this->ModelType);
            });
        });
    }
}
