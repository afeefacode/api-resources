<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Filter\FilterBag;
use Afeefa\ApiResources\Filter\Filters\KeywordFilter;
use Afeefa\ApiResources\Resource\Resource;
use Afeefa\ApiResources\Type\Type;
use Backend\Types\ArticleType;
use Backend\Types\AuthorType;
use Backend\Types\CommentType;

class SearchResource extends Resource
{
    protected static string $type = 'Example.SearchResource';

    protected function actions(ActionBag $actions): void
    {
        $actions->query(
            'search',
            Type::list([ArticleType::class, AuthorType::class, CommentType::class]),
            function (Action $action) {
                $action->filters(function (FilterBag $filters) {
                    $filters->add('q', KeywordFilter::class);
                });
            }
        );
    }
}
