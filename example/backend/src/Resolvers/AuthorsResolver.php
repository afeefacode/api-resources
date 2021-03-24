<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\RelationResolver;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Medoo\Medoo;

class AuthorsResolver
{
    public function resolve_author_relation(RelationResolver $r, Medoo $db)
    {
        $r
            ->ownerIdFields(['author_id'])

            ->load(function (array $owners, array $selectFields) use ($db) {
                /** @var ModelInterface[] $owners */
                $authorIds = array_unique(
                    array_map(function (ModelInterface $owner) {
                        return $owner->author_id;
                    }, $owners)
                );
                sort($authorIds);

                $objects = $db->select(
                    'authors',
                    ['id' => $selectFields],
                    [
                        'id' => $authorIds,
                        'ORDER' => 'id'
                    ]
                );
                return $objects;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                $key = intval($owner->author_id);
                $object = $objects[$key] ?? null;
                if ($object) {
                    return Model::fromSingle($objects[$key]);
                }
            });
    }
}
