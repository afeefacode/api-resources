<?php

namespace Backend\Api;

use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Resource\ResourceBag;
use Backend\Resources\ArticleResource;
use Backend\Resources\AuthorResource;
use Backend\Resources\TagResource;
use Backend\Types\AuthorType;

class BackendApi extends Api
{
    protected static string $type = 'Example.BackendApi';

    protected function resources(ResourceBag $resources): void
    {
        $resources
            ->add(ArticleResource::class)
            ->add(TagResource::class)
            ->add(function (AuthorResource $resource) {
                // $resource->removeAction('get_authors');
            });
    }

    // protected function types(TypeBag $types): void
    // {
    //     $types->get(function (AuthorType $authorType) {
    //         $authorType->removeRelation('articles');
    //     });
    // }
}
