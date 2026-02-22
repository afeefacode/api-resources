<?php

namespace Backend\Api;

use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Resource\ResourceBag;
use Backend\Resources\AppResource;
use Backend\Resources\ArticleResource;
use Backend\Resources\AuthorResource;
use Backend\Resources\TagResource;

class BackendApi extends Api
{
    protected static string $type = 'Example.BackendApi';

    protected function resources(ResourceBag $resources): void
    {
        $resources
            ->add(AppResource::class)
            ->add(ArticleResource::class)
            ->add(TagResource::class)
            ->add(AuthorResource::class);
    }
}
