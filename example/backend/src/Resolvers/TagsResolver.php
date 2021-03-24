<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\RelationResolver;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Backend\Types\TagType;
use Medoo\Medoo;

class TagsResolver
{
    public function resolve_tag_users_relation(RelationResolver $r, Medoo $db)
    {
        $r
            ->load(function (array $owners, array $selectFields) use ($db) {
                $tagIds = array_unique(
                    array_map(function (ModelInterface $owner) {
                        return $owner->id;
                    }, $owners)
                );

                $result = $db->select(
                    'tag_users',
                    '*',
                    ['tag_id' => $tagIds]
                );

                $ownerIdsByType = [];
                foreach ($result as $row) {
                    $ownerIdsByType[$row['user_type']][] = $row['user_id'];
                }

                $ownerTagMap = [];
                foreach ($result as $row) {
                    $type = 'Example.' . $row['user_type'] . 'Type';
                    $key = $type . ':' . $row['user_id'];
                    $ownerTagMap[$key] = $row['tag_id'];
                }

                $models = [];

                foreach ($ownerIdsByType as $type => $ids) {
                    $table = $type === 'Article' ? 'articles' : 'authors';
                    $type = 'Example.' . $type . 'Type';

                    $result = $db->select(
                        $table,
                        $selectFields,
                        [
                            'id' => $ids
                        ]
                    );

                    foreach ($result as $row) {
                        $key = $type . ':' . $row['id'];
                        $tagId = $ownerTagMap[$key];

                        $models[$tagId][] = Model::fromSingle($type, $row);
                    }
                }

                return $models;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                $key = $owner->id;
                return $objects[$key];
            });
    }

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

                $models = [];
                foreach ($result as $row) {
                    $key = $row['user_type'] . ':' . $row['user_id'];
                    $object = [];
                    foreach ($selectFields as $selectField) {
                        $object[$selectField] = $row[$fieldMap[$selectField]];
                    }
                    $models[$key][] = Model::fromSingle(TagType::$type, $object);
                }
                return $models;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                $key = 'Article:' . $owner->id;
                return $objects[$key];
            });
    }
}
