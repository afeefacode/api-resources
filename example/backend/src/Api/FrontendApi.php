<?php

namespace Backend\Api;

use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Resource\ResourceBag;
use Backend\Resources\ArticleResource;
use Backend\Resources\AuthorResource;
use Backend\Resources\TagResource;

class FrontendApi extends Api
{
    protected function resources(ResourceBag $resources): void
    {
        $resources
            ->add(ArticleResource::class)

            ->add(TagResource::class)

            ->add(function (AuthorResource $resource) {
                $resource->allowActions([
                    'get_authors',
                    'create_author'
                ]);
            });
    }
}
