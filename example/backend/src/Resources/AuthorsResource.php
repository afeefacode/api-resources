<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Filter\FilterBag;
use Afeefa\ApiResources\Filter\Filters\KeywordFilter;
use Afeefa\ApiResources\Filter\Filters\OrderFilter;
use Afeefa\ApiResources\Filter\Filters\PageFilter;
use Afeefa\ApiResources\Filter\Filters\PageSizeFilter;
use Afeefa\ApiResources\Resource\Resource;
use Afeefa\ApiResources\Type\Type;
use Backend\Resolvers\AuthorsResolver;
use Backend\Types\AuthorType;

class AuthorsResource extends Resource
{
    public static string $type = 'Example.AuthorsResource';

    protected function actions(ActionBag $actions): void
    {
        $actions->add('get_authors', function (Action $action) {
            $action->filters(function (FilterBag $filters) {
                $filters->add('q', KeywordFilter::class);

                $filters->add('order', function (OrderFilter $filter) {
                    $filter
                        ->fields([
                            'id' => [OrderFilter::DESC, OrderFilter::ASC],
                            'name' => [OrderFilter::DESC, OrderFilter::ASC],
                            'count_articles' => [OrderFilter::DESC, OrderFilter::ASC]
                        ])
                        ->default(['id' => OrderFilter::ASC]);
                });

                $filters->add('page_size', function (PageSizeFilter $filter) {
                    $filter
                        ->pageSizes([5, 10, 15])
                        ->default(10);
                });

                $filters->add('page', PageFilter::class);
            });

            $action->response(Type::listOf(AuthorType::class));

            $action->resolve([AuthorsResolver::class, 'get_authors']);
        });
    }
}
