<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Resource\Resource;

class AuthorsResource extends Resource
{
    public string $type = 'Example.Authors';

    public function actions(ActionBag $actions): void
    {
        $actions->action('get_authors', function (Action $action) {
        });
    }
}
