<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Action\ActionResponse;
use Afeefa\ApiResources\Filter\FilterBag;
use Afeefa\ApiResources\Resource\Resource;
use Backend\Models\Author;
use Backend\Models\Comment;

class SearchResource extends Resource
{
    public string $type = 'Example.Authors';

    public function actions(ActionBag $actions): void
    {
        $actions->add('search', function (Action $action) {
            $action->filters(function (FilterBag $filters) {
                $filters->keyword('q');
            });

            $action->response(function (ActionResponse $response) {
                $response
                    ->types([
                        Article::class,
                        Author::class,
                        Comment::class
                    ]);
            });
        });
    }
}
