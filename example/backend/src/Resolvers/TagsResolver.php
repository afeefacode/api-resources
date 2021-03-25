<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\RelationResolver;
use Afeefa\ApiResources\DB\ResolveContext;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Backend\Types\TagType;
use Medoo\Medoo;

class TagsResolver
{
    public function resolve_tag_users_relation(RelationResolver $r, Medoo $db)
    {
        $r
            ->load(function (array $owners, ResolveContext $c) use ($db) {
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

                $ownersTagMap = [];
                foreach ($result as $row) {
                    $key = $row['user_type'] . ':' . $row['user_id'];
                    $ownersTagMap[$key][] = $row['tag_id'];
                }

                $models = [];

                foreach ($ownerIdsByType as $typeName => $ids) {
                    $table = $typeName === 'Example.ArticleType' ? 'articles' : 'authors';

                    $selectFields = $c->getSelectFields($typeName);

                    $result = $db->select(
                        $table,
                        $selectFields,
                        [
                            'id' => $ids
                        ]
                    );

                    foreach ($result as $row) {
                        $key = $typeName . ':' . $row['id'];
                        $tagIds = $ownersTagMap[$key];
                        foreach ($tagIds as $tagId) {
                            $models[$tagId][] = Model::fromSingle($typeName, $row);
                        }
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
            ->load(function (array $owners, ResolveContext $c) use ($db) {
                $selectFields = $c->getSelectFields();

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
                    $ownerIdsByType[$owner->type][] = $owner->id;
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
                $key = $owner->type . ':' . $owner->id;
                return $objects[$key] ?? [];
            });
    }
}
