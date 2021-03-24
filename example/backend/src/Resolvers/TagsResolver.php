<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\RelationResolver;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Medoo\Medoo;

class TagsResolver
{
    public function resolve_tags_relation(RelationResolver $r, Medoo $db)
    {
        $r
            ->load(function (array $owners, array $selectFields) use ($r, $db) {
                /** @var ModelInterface[] $owners */
                $fieldMap = [];
                $queryFields = [];
                foreach ($selectFields as $selectField) {
                    $alias = "tag_{$selectField}";
                    $fieldMap[$selectField] = $alias;
                    $queryFields[] = "tags.{$selectField}({$alias})";
                }

                $where = [];

                $ownerIdsByType = [];
                foreach ($owners as $owner) {
                    $ownerIdsByType['Article'][] = $owner->id;
                }

                foreach ($ownerIdsByType as $type => $ids) {
                    $where['AND #' . $type] // key hack, see medoo docs https://medoo.in/api/where
                        = [
                            'tag_users.user_type' => $type,
                            'tag_users.user_id' => $ids
                        ];
                }

                $result = $db->select(
                    'tag_users',
                    ['[>]tags' => ['tag_id' => 'id']],
                    [
                        'tag_users.user_id', 'tag_users.user_type',
                        ...$queryFields
                    ],
                    [
                        'OR' => $where,
                        'ORDER' => 'tag_users.id'
                    ]
                );

                $objects = [];
                foreach ($result as $row) {
                    $key = $row['user_type'] . ':' . $row['user_id'];
                    $object = [];
                    foreach ($selectFields as $selectField) {
                        $object[$selectField] = $row[$fieldMap[$selectField]];
                    }
                    $objects[$key][] = Model::fromSingle($object);
                }
                return $objects;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                $key = 'Article:' . $owner->id;
                return $objects[$key];
            });
    }
}
