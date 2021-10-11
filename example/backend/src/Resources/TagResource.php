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
    public static string $type = 'Example.TagResource';

    protected function actions(ActionBag $actions): void
    {
        $actions->add('get_tags', function (Action $action) {
            $action->response(Type::list(TagType::class));

            $action->resolve([TagsResolver::class, 'get_tags']);
        });
    }
}
