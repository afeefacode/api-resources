<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Resolver\QueryActionResolver;
use Afeefa\ApiResources\Resource\Resource;
use Backend\Types\CountsType;
use Medoo\Medoo;

class AppResource extends Resource
{
    protected static string $type = 'Example.AppResource';

    protected function actions(ActionBag $actions): void
    {
        $actions->add('get_counts', function (Action $action) {
            $action
                ->response(CountsType::class)

                ->resolve(function (QueryActionResolver $r, Medoo $db) {
                    $r->load(function () use ($r, $db) {
                        $attributes = [
                            'id' => 'app'
                        ];

                        if ($r->fieldIsRequested('count_articles')) {
                            $attributes['count_articles'] = $db->count('articles');
                        }

                        if ($r->fieldIsRequested('count_authors')) {
                            $attributes['count_authors'] = $db->count('authors');
                        }

                        return Model::fromSingle('Example.Counts', $attributes);
                    });
                });
        });
    }
}
