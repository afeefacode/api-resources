<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Resource\Resource;
use Afeefa\ApiResources\Type\Type;
use Backend\Resolvers\TagsResolver;
use Backend\Types\TagType;

class TagResource extends Resource
{
    protected static string $type = 'Example.TagResource';

    protected function actions(ActionBag $actions): void
    {
        $actions->query('get_tags', Type::list(TagType::class), function (Action $action) {
            $action->resolve([TagsResolver::class, 'get_tags']);
        });
    }
}
