<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\RelationResolver;
use Afeefa\ApiResources\DB\TypeLoader;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
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

    public function resolve_articles_relation(RelationResolver $r, Medoo $db)
    {
        $r
            ->load(function (array $owners, array $selectFields) use ($db) {
                /** @var ModelInterface[] $owners */
                $selectFields = array_merge($selectFields, ['author_id']);

                $authorIds = array_unique(
                    array_map(function (ModelInterface $owner) {
                        return $owner->id;
                    }, $owners)
                );

                $result = $db->select(
                    'articles',
                    $selectFields,
                    [
                        'author_id' => $authorIds,
                        'ORDER' => [
                            'date' => 'DESC'
                        ]
                    ]
                );

                $objects = [];
                foreach ($result as $row) {
                    $key = $row['author_id'];
                    $objects[$key][] = Model::fromSingle($row);
                }
                return $objects;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                $key = $owner->id;
                return $objects[$key];
            });
    }
}
