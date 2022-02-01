<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Resolver\QueryRelationResolver;
use Backend\Types\CommentType;
use Closure;
use Medoo\Medoo;

class CommentsResolver
{
    public function resolve_comments_relation(QueryRelationResolver $r, Medoo $db)
    {
        $r
            ->count(function (array $owners) use ($db) {
                $ownerIdsByType = [];
                foreach ($owners as $owner) {
                    $ownerIdsByType[$owner->type][] = $owner->id;
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
                    [
                        'count' => Medoo::raw('COUNT(owner_id)'),
                        'owner_id',
                        'owner_type'
                    ],
                    [
                        'OR' => $where,
                        'GROUP' => ['owner_id', 'owner_type']
                    ]
                );

                foreach ($result as $row) {
                    $key = $row['owner_type'] . ':' . $row['owner_id'];
                    yield $key => intval($row['count']);
                }
            })

            ->get(function (array $owners, Closure $getSelectFields) use ($db) {
                /** @var ModelInterface[] $owners */
                $selectFields = array_merge($getSelectFields(), ['owner_type', 'owner_id']);

                $ownerIdsByType = [];
                foreach ($owners as $owner) {
                    $ownerIdsByType[$owner->type][] = $owner->id;
                }

                foreach ($ownerIdsByType as $type => $ids) {
                    $where['AND #' . $type] // key hack, see medoo docs https://medoo.in/api/where
                        = [
                            'owner_type' => $type,
                            'owner_id' => $ids
                        ];
                }

                // debug_dump($ownerIdsByType);

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

                    if ($key === 30) {
                        debug_dump($key, $row);
                    }

                    $objects[$key][] = Model::fromSingle(CommentType::type(), $row);
                }
                return $objects;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                $key = $owner->type . ':' . $owner->id;
                return $objects[$key] ?? [];
            });
    }
}
