<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Action\ActionParams;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Field\Fields\IdAttribute;
use Afeefa\ApiResources\Filter\FilterBag;
use Afeefa\ApiResources\Filter\Filters\KeywordFilter;
use Afeefa\ApiResources\Filter\Filters\OrderFilter;
use Afeefa\ApiResources\Filter\Filters\PageFilter;
use Afeefa\ApiResources\Filter\Filters\PageSizeFilter;
use Afeefa\ApiResources\Filter\Filters\SelectFilter;
use Afeefa\ApiResources\Resource\Resource;
use Afeefa\ApiResources\Type\Type;
use Backend\Resolvers\ArticlesResolver;
use Backend\Types\ArticleType;

class ArticleResource extends Resource
{
    protected static string $type = 'Example.ArticleResource';

    protected function actions(ActionBag $actions): void
    {
        $actions
            ->query('get_articles', Type::list(ArticleType::class), function (Action $action) {
                $action->params(function (ActionParams $params) {
                    $params->attribute('author_id', IdAttribute::class);
                });

                $action->filters(function (FilterBag $filters) {
                    $filters->add('author_id', function (SelectFilter $filter) {
                        $filter->optionsRequest(function (ApiRequest $request) {
                            $request
                                ->resourceType(AuthorResource::type())
                                ->actionName('get_authors')
                                ->fields(['name' => true, 'count_articles' => true]);
                        });
                    });

                    $filters->add('tag_id', function (SelectFilter $filter) {
                        $filter->optionsRequest(function (ApiRequest $request) {
                            $request
                                ->resourceType(TagResource::type())
                                ->actionName('get_tags')
                                ->fields(['name' => true, 'count_users' => true]);
                        });
                    });

                    $filters->add('q', KeywordFilter::class);

                    $filters->add('order', function (OrderFilter $filter) {
                        $filter
                            ->fields([
                                'id' => [OrderFilter::DESC, OrderFilter::ASC],
                                'title' => [OrderFilter::ASC, OrderFilter::DESC],
                                'date' => [OrderFilter::DESC, OrderFilter::ASC],
                                'count_comments' => [OrderFilter::DESC, OrderFilter::ASC],
                                'author_name' => [OrderFilter::ASC, OrderFilter::DESC]
                            ])
                            ->default(['date' => OrderFilter::DESC]);
                    });

                    $filters->add('page_size', function (PageSizeFilter $filter) {
                        $filter
                            ->pageSizes([15, 30, 50])
                            ->default(30);
                    });

                    $filters->add('page', PageFilter::class);
                });

                $action->resolve([ArticlesResolver::class, 'get_articles']);
            })

            ->query('get_article', ArticleType::class, function (Action $action) {
                $action
                    ->params(function (ActionParams $params) {
                        $params->attribute('id', IdAttribute::class);
                    })

                    ->resolve([ArticlesResolver::class, 'get_article']);
            })

            ->mutation('save_article', ArticleType::class, function (Action $action) {
                $action
                    ->params(function (ActionParams $params) {
                        $params->attribute('id', IdAttribute::class);
                    })

                    ->response(ArticleType::class)

                    ->resolve([ArticlesResolver::class, 'save_article']);
            });
    }
}
