<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Action\ActionInput;
use Afeefa\ApiResources\Action\ActionParams;
use Afeefa\ApiResources\Action\ActionResponse;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Field\Fields\IdField;
use Afeefa\ApiResources\Filter\FilterBag;
use Afeefa\ApiResources\Filter\Filters\BooleanFilter;
use Afeefa\ApiResources\Filter\Filters\IdFilter;
use Afeefa\ApiResources\Filter\Filters\KeywordFilter;
use Afeefa\ApiResources\Filter\Filters\OrderFilter;
use Afeefa\ApiResources\Filter\Filters\PageFilter;
use Afeefa\ApiResources\Resource\ModelResource;
use Backend\Types\ArticleType;
use Medoo\Medoo;

class ArticlesResource extends ModelResource
{
    public static string $type = 'Example.Articles';

    protected string $ModelType = ArticleType::class;

    protected function actions(ActionBag $actions): void
    {
        parent::actions($actions);

        $actions->add('get_articles', function (Action $action) {
            $action->filters(function (FilterBag $filters) {#
                $filters->add('author_id', function (IdFilter $filter) {
                    $filter->request(function (ApiRequest $request) {
                        // $request
                        //     ->action([AuthorsResource::class, 'test']);
                    });
                });

                $filters->add('tag_id', function (IdFilter $filter) {
                    $filter->request(function (ApiRequest $request) {
                        //     $request
                        //         ->action([ArticlesResource::class, 'getTags'])
                        //         ->filter('user_type', 'Example.Article');
                    });
                });

                $filters->add('tag_id', function (BooleanFilter $filter) {
                    $filter->values([true, false]);
                });

                $filters->add('page', function (PageFilter $filter) {
                    $filter->pageSizes([15, 30, 50], 15);
                });

                $filters->add('q', KeywordFilter::class);

                $filters->add('order', function (OrderFilter $filter) {
                    $filter->values([
                        'date' => ['desc', 'asc']
                    ]);
                });
            });

            $action->response(function (ActionResponse $response) {
                $response
                    ->type(ArticleType::class)
                    ->list();
            });

            $action->execute(function (Medoo $db, ArticleType $articleType, ApiRequest $request) {
                $fields = $request->getFields();
                $fieldsMap = [
                    'article' => []
                ];
                foreach ($fields as $field) {
                    if (is_array($field)) {
                        foreach ($field as $subField => $subFields) {
                            if ($articleType->hasRelation($subField)) {
                                $relation = $articleType->getRelation($subField);

                                $fieldsMap['article'] = array_merge($fieldsMap['article'], $relation->params()->getDepends());
                                $fieldsMap[$subField] = array_merge($subFields, $relation->params()->getDepends($subField));
                            }
                        }
                    } else {
                        $fieldsMap['article'][] = $field;
                    }
                }

                $articles = $db->select(
                    'articles',
                    $fieldsMap['article'],
                    ['ORDER' => 'id']
                );

                if (isset($fieldsMap['author'])) {
                    $authorIds = array_map(function ($article) {
                        return $article['author_id'];
                    }, $articles);
                    $authors = $db->select(
                        'authors',
                        $fieldsMap['author'],
                        ['id' => $authorIds]
                    );
                    foreach ($articles as &$article) {
                        foreach ($authors as $author) {
                            if ($article['author_id'] === $author['id']) {
                                $article['author'] = $author;
                            }
                        }
                    }
                }

                return $articles;
            });
        });

        $actions->add('get_article', function (Action $action) {
            $action->params(function (ActionParams $params) {
                $params->add('id', IdField::class);
            });

            $action->response(function (ActionResponse $response) {
                $response->type(ArticleType::class);
            });
        });

        $actions->add('create_article', function (Action $action) {
            $action->input(function (ActionInput $input) {
                $input->type(ArticleType::class);
            });

            $action->response(function (ActionResponse $response) {
                $response->type(ArticleType::class);
            });
        });

        $actions->add('update_article', function (Action $action) {
            $action
                ->input(function (ActionInput $input) {
                    $input->type(ArticleType::class);
                })

                ->response(function (ActionResponse $response) {
                    $response->type(ArticleType::class);
                });
        });

        $actions->add('update_articles', function (Action $action) {
            $action
                ->params(function (ActionParams $params) {
                    $params->add('id', IdField::class);
                    // $params->id('id')->list();
                })

                ->input(function (ActionInput $input) {
                    $input->type(ArticleType::class);
                })

                ->response(function (ActionResponse $response) {
                    $response->type(ArticleType::class);
                });
        });

        $actions->add('delete_article', function (Action $action) {
            $action->params(function (ActionParams $params) {
                $params->add('id', IdField::class);
            });

            $action->inputType = ArticleType::class;
            $action->outputType = 'test';
        });

        $actions->add('delete_articles', function (Action $action) {
            $action->inputType = ArticleType::class;
            $action->outputType = 'test';
        });
    }
}
