<?php

namespace Backend\Api;

use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Resource\ResourceBag;
use Backend\Resources\ArticlesResource;
use Backend\Resources\AuthorsResource;
use Backend\Resources\TagsResource;
use Backend\Types\AuthorType;

class BackendApi extends Api
{
    protected function resources(ResourceBag $resources): void
    {
        $resources
            ->add(ArticlesResource::class)
            ->add(TagsResource::class)
            ->add(function (AuthorsResource $resource) {
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
