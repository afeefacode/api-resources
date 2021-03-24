<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\RelationResolver;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Backend\Types\AuthorType;
use Closure;
use Medoo\Medoo;

class AuthorsResolver
{
    public function resolve_author_relation(RelationResolver $r, Medoo $db)
    {
        $r
            ->ownerIdFields(['author_id'])

            ->load(function (array $owners, Closure $getSelectFields) use ($db) {
                /** @var ModelInterface[] $owners */
                $authorIds = array_unique(
                    array_map(function (ModelInterface $owner) {
                        return $owner->author_id;
                    }, $owners)
                );

                $result = $db->select(
                    'authors',
                    $getSelectFields(),
                    [
                        'id' => $authorIds,
                        'ORDER' => 'id'
                    ]
                );

                $models = [];
                foreach ($result as $row) {
                    $models[$row['id']] = Model::fromSingle(AuthorType::$type, $row);
                }
                return $models;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                return $objects[$owner->author_id];
            });
    }
}
