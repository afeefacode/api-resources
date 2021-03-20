<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Action\ActionResponse;
use Afeefa\ApiResources\Resource\Resource;
use Backend\Types\AuthorType;

class AuthorsResource extends Resource
{
    public static string $type = 'Example.AuthorsResource';

    protected function actions(ActionBag $actions): void
    {
        $actions->add('get_authors', function (Action $action) {
            $action->response(function (ActionResponse $response) {
                $response
                    ->type(AuthorType::class)
                    ->list();
            });
        });
    }
}
