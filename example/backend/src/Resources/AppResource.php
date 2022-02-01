<?php

namespace Backend\Resources;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Resolver\QueryActionResolver;
use Afeefa\ApiResources\Resource\Resource;
use Backend\Types\CountsType;
use Closure;
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
                    $r->get(function (ApiRequest $request, Closure $getSelectFields) use ($db) {
                        $selectFields = $getSelectFields();

                        $attributes = ['id' => 'app'];

                        if (in_array('count_articles', $selectFields)) {
                            $attributes['count_articles'] = $db->count('articles');
                        }

                        if (in_array('count_authors', $selectFields)) {
                            $attributes['count_authors'] = $db->count('authors');
                        }

                        return Model::fromSingle('Example.Counts', $attributes);
                    });
                });
        });
    }
}
