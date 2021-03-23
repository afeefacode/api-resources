<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\RelationLoader;
use Afeefa\ApiResources\Model\Model;
use Medoo\Medoo;

class AuthorsResolver
{
    public function get_author_relation(RelationLoader $relationLoader, Medoo $db)
    {
        return $relationLoader
            ->mapKeys('author_id', 'id')
            ->load(function (array $authorIds, array $selectFields) use ($db) {
                $objects = $db->select(
                    'authors',
                    $selectFields,
                    [
                        'id' => $authorIds,
                        'ORDER' => 'id'
                    ]
                );
                return Model::fromList($objects);
            });
    }
}
