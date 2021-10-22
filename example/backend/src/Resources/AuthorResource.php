<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Action\ActionParams;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Field\Fields\IdAttribute;
use Afeefa\ApiResources\Filter\FilterBag;
use Afeefa\ApiResources\Filter\Filters\IdFilter;
use Afeefa\ApiResources\Filter\Filters\KeywordFilter;
use Afeefa\ApiResources\Filter\Filters\OrderFilter;
use Afeefa\ApiResources\Filter\Filters\PageFilter;
use Afeefa\ApiResources\Filter\Filters\PageSizeFilter;
use Afeefa\ApiResources\Resource\Resource;
use Afeefa\ApiResources\Type\Type;
use Backend\Resolvers\AuthorsResolver;
use Backend\Types\AuthorType;

class AuthorResource extends Resource
{
    public static string $type = 'Example.AuthorResource';

    protected function actions(ActionBag $actions): void
    {
        $actions->add('get_authors', function (Action $action) {
            $action->filters(function (FilterBag $filters) {
                $filters->add('q', KeywordFilter::class);

                $filters->add('tag_id', function (IdFilter $filter) {
                    $filter->optionsRequest(function (ApiRequest $request) {
                        $request
                            ->resourceType(TagResource::$type)
                            ->actionName('get_tags')
                            ->fields(['name' => true, 'count_users' => true]);
                    });
                });

                $filters->add('order', function (OrderFilter $filter) {
                    $filter
                        ->fields([
                            'id' => [OrderFilter::DESC, OrderFilter::ASC],
                            'name' => [OrderFilter::ASC], OrderFilter::DESC,
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

            $action->response(Type::list(AuthorType::class));

            $action->resolve([AuthorsResolver::class, 'get_authors']);
        });

        $actions->add('get_author', function (Action $action) {
            $action
                ->params(function (ActionParams $params) {
                    $params->attribute('id', IdAttribute::class);
                })

                ->response(AuthorType::class)

                ->resolve([AuthorsResolver::class, 'get_author']);
        });

        $actions->add('update_author', function (Action $action) {
            $action
                ->params(function (ActionParams $params) {
                    $params->attribute('id', IdAttribute::class);
                })

                ->input(AuthorType::class)

                ->response(AuthorType::class)

                ->resolve([AuthorsResolver::class, 'update_author']);
        });
    }
}
