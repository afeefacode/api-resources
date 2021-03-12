<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Action\ActionInput;
use Afeefa\ApiResources\Action\ActionParams;
use Afeefa\ApiResources\Action\ActionResponse;
use Afeefa\ApiResources\Api\Request;
use Afeefa\ApiResources\Field\Fields\IdField;
use Afeefa\ApiResources\Filter\FilterBag;
use Afeefa\ApiResources\Resource\Resource;
use Backend\Types\ArticleType;

class ArticlesResource extends Resource
{
    public string $type = 'Example.Articles';

    public function actions(ActionBag $actions): void
    {
        $actions->action('get_articles', function (Action $action) {
            $action->filters(function (FilterBag $filters) {
                $filters->id('autor_id')
                    ->request(function (Request $request) {
                        // $request
                        //     ->action([AuthorsResource::class, 'test']);
                    });

                $filters->id('tag_id');
                // ->request(function (Request $request) {
                //     $request
                //         ->action([ArticlesResource::class, 'getTags'])
                //         ->filter('user_type', 'Example.Article');
                // });

                $filters->boolean('has_comments')
                    ->values([true, false]);

                $filters->page('page')
                    ->pageSizes([15, 30, 50], 15);

                $filters->keyword('q');

                $filters->order('order')
                    ->values([
                        'date' => ['desc', 'asc']
                    ]);
            });

            $action->response(function (ActionResponse $response) {
                $response
                    ->type(ArticleType::class)
                    ->list();
            });
        });

        $actions->action('get_article', function (Action $action) {
            $action->params(function (ActionParams $params) {
                $params->add('id', IdField::class);
            });

            $action->response(function (ActionResponse $response) {
                $response->type(ArticleType::class);
            });
        });

        $actions->action('create_article', function (Action $action) {
            $action->input(function (ActionInput $input) {
                $input->type(ArticleType::class);
            });

            $action->response(function (ActionResponse $response) {
                $response->type(ArticleType::class);
            });
        });

        $actions->action('update_article', function (Action $action) {
            $action
                ->input(function (ActionInput $input) {
                    $input->type(ArticleType::class);
                })

                ->response(function (ActionResponse $response) {
                    $response->type(ArticleType::class);
                });
        });

        $actions->action('update_articles', function (Action $action) {
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

        $actions->action('delete_article', function (Action $action) {
            $action->params(function (ActionParams $params) {
                $params->add('id', IdField::class);
            });

            $action->inputType = ArticleType::class;
            $action->outputType = 'test';
        });

        $actions->action('delete_articles', function (Action $action) {
            $action->inputType = ArticleType::class;
            $action->outputType = 'test';
        });
    }
}
