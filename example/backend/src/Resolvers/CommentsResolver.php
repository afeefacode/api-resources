<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\RelationResolver;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Backend\Types\CommentType;
use Medoo\Medoo;

class CommentsResolver
{
    public function resolve_comments_relation(RelationResolver $r, Medoo $db)
    {
        $r
            ->load(function (array $owners, array $selectFields) use ($db) {
                /** @var ModelInterface[] $owners */
                $selectFields = array_merge($selectFields, ['owner_type', 'owner_id']);

                $ownerIdsByType = [];
                foreach ($owners as $owner) {
                    $ownerIdsByType['Article'][] = $owner->id;
                }

                foreach ($ownerIdsByType as $type => $ids) {
                    $where['AND #' . $type] // key hack, see medoo docs https://medoo.in/api/where
                        = [
                            'owner_type' => $type,
                            'owner_id' => $ids
                        ];
                }

                $result = $db->select(
                    'comments',
                    $selectFields,
                    [
                        'OR' => $where,
                        'ORDER' => [
                            'date' => 'DESC'
                        ]
                    ]
                );

                $objects = [];
                foreach ($result as $row) {
                    $key = $row['owner_type'] . ':' . $row['owner_id'];
                    $objects[$key][] = Model::fromSingle(CommentType::$type, $row);
                }
                return $objects;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                $key = 'Article:' . $owner->id;
                return $objects[$key];
            });
    }
}
