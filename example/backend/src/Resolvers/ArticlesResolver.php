<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\TypeLoader;
use Afeefa\ApiResources\Model\Model;
use Medoo\Medoo;

class ArticlesResolver
{
    public function get_articles(TypeLoader $typeLoader, Medoo $db)
    {
        return $typeLoader
            ->load(function (array $selectFields) use ($db) {
                $objects = $db->select(
                    'articles',
                    $selectFields,
                    [
                        'ORDER' => 'id',
                        'LIMIT' => 10
                    ]
                );
                return Model::fromList($objects);
            });
    }
}
