<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Action\ActionParams;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Field\Fields\IdAttribute;
use Afeefa\ApiResources\Filter\FilterBag;
use Afeefa\ApiResources\Filter\Filters\BooleanFilter;
use Afeefa\ApiResources\Filter\Filters\IdFilter;
use Afeefa\ApiResources\Filter\Filters\KeywordFilter;
use Afeefa\ApiResources\Filter\Filters\OrderFilter;
use Afeefa\ApiResources\Filter\Filters\PageFilter;
use Afeefa\ApiResources\Filter\Filters\PageSizeFilter;
use Afeefa\ApiResources\Resource\ModelResource;
use Afeefa\ApiResources\Type\Type;
use Backend\Resolvers\ArticlesResolver;
use Backend\Types\ArticleType;

class ArticlesResource extends ModelResource
{
    public static string $type = 'Example.ArticlesResource';

    protected string $ModelTypeClass = ArticleType::class;

    protected function actions(ActionBag $actions): void
    {
        parent::actions($actions);

        $actions->add('get_articles', function (Action $action) {
            $action->filters(function (FilterBag $filters) {#
                $filters->add('author_id', function (IdFilter $filter) {
                    // $filter->request(function (ApiRequest $request) {
                    //     $request
                    //         ->action([AuthorsResource::class, 'test']);
                    // });
                });

                $filters->add('tag_id', function (IdFilter $filter) {
                    // $filter->request(function (ApiRequest $request) {
                    //         $request
                    //             ->action([ArticlesResource::class, 'getTags'])
                    //             ->filter('user_type', 'Example.Article');
                    // });
                });

                $filters->add('has_comments', function (BooleanFilter $filter) {
                    $filter->values([true, false]);
                });

                $filters->add('has_comments2', BooleanFilter::class);

                $filters->add('q', KeywordFilter::class);

                $filters->add('order', function (OrderFilter $filter) {
                    $filter
                        ->fields([
                            'id' => [OrderFilter::DESC, OrderFilter::ASC],
                            'title' => [OrderFilter::DESC, OrderFilter::ASC],
                            'date' => [OrderFilter::DESC, OrderFilter::ASC],
                            'count_comments' => [OrderFilter::DESC, OrderFilter::ASC]
                        ])
                        ->default(['id' => OrderFilter::ASC]);
                });

                $filters->add('page_size', function (PageSizeFilter $filter) {
                    $filter
                        ->pageSizes([15, 30, 50])
                        ->default(30);
                });

                $filters->add('page', PageFilter::class);
            });

            $action->response(Type::listOf(ArticleType::class));

            $action->resolve([ArticlesResolver::class, 'get_articles']);
        });

        $actions->add('get_article', function (Action $action) {
            $action->params(function (ActionParams $params) {
                $params->attribute('id', IdAttribute::class);
            });

            $action->response(ArticleType::class);
        });

        $actions->add('create_article', function (Action $action) {
            $action
                ->input(ArticleType::class)
                ->response(ArticleType::class);
        });

        $actions->add('update_article', function (Action $action) {
            $action
                ->input(ArticleType::class)
                ->response(ArticleType::class);
        });

        $actions->add('update_articles', function (Action $action) {
            $action
                ->params(function (ActionParams $params) {
                    $params->attribute('id', IdAttribute::class);
                    // $params->id('id')->list();
                })

                ->input(ArticleType::class)
                ->response(ArticleType::class);
        });

        $actions->add('delete_article', function (Action $action) {
            $action->params(function (ActionParams $params) {
                $params->attribute('id', IdAttribute::class);
            });
        });

        $actions->add('delete_articles', function (Action $action) {
        });
    }
}
