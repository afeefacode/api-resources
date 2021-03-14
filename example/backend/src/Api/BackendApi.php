<?php

namespace Backend\Api;

use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Resource\ResourceBag;
use Backend\Resources\ArticlesResource;
use Backend\Resources\AuthorsResource;
use Backend\Types\AuthorType;

class BackendApi extends Api
{
    public function resources(ResourceBag $resources): void
    {
        $resources
            ->add(ArticlesResource::class)
            ->add(function (AuthorsResource $resource) {
                // $resource->removeAction('get_authors');
            });
    }

    // public function types(TypeBag $types): void
    // {
    //     $types->get(function (AuthorType $authorType) {
    //         $authorType->removeRelation('articles');
    //     });
    // }
}
