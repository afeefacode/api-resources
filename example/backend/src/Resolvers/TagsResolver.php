<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Resolver\ActionResult;
use Afeefa\ApiResources\Resolver\QueryActionResolver;
use Afeefa\ApiResources\Resolver\QueryRelationResolver;
use Backend\Types\TagType;
use Closure;
use Medoo\Medoo;

class TagsResolver
{
    public function get_tags(QueryActionResolver $r, Medoo $db)
    {
        $r
            ->get(function (ApiRequest $request, Closure $getSelectFields) use ($db) {
                $count = $db->count('tags');

                $objects = $db->select(
                    'tags',
                    $getSelectFields()
                );

                return (new ActionResult())
                    ->data(Model::fromList(TagType::type(), $objects))

                    ->meta([
                        'count_all' => $count,
                        'count_filter' => $count,
                        'count_search' => $count
                    ]);
            });
    }

    public function resolve_tag_users_relation(QueryRelationResolver $r, Medoo $db)
    {
        $r
            ->count(function (array $owners) use ($db) {
                $tagIds = array_unique(
                    array_map(function (ModelInterface $owner) {
                        return $owner->id;
                    }, $owners)
                );

                $result = $db->select(
                    'tag_users',
                    [
                        'count' => Medoo::raw('COUNT(tag_id)'),
                        'tag_id'
                    ],
                    [
                        'tag_id' => $tagIds,
                        'GROUP' => 'tag_id'
                    ]
                );

                foreach ($result as $row) {
                    yield $row['tag_id'] => intval($row['count']);
                }
            })

            ->get(function (array $owners, Closure $getSelectFields) use ($db) {
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
                    $table = $typeName === 'Example.Article' ? 'articles' : 'authors';

                    $result = $db->select(
                        $table,
                        $getSelectFields($typeName),
                        ['id' => $ids]
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
                return $objects[$key] ?? [];
            });
    }

    public function resolve_tags_relation(QueryRelationResolver $r, Medoo $db)
    {
        $r
            ->get(function (array $owners, Closure $getSelectFields) use ($db) {
                $selectFields = $getSelectFields();

                $queryFields = ['tag_users.user_id', 'tag_users.user_type'];

                /** @var ModelInterface[] $owners */
                $fieldMap = [];
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
                    $queryFields,
                    [
                        'OR' => $where,
                        'ORDER' => 'tag_users.id'
                    ]
                );

                $models = [];
                foreach ($result as $row) {
                    $key = $row['user_type'] . ':' . $row['user_id'];
                    $object = [];
                    foreach (array_keys($fieldMap) as $selectField) {
                        $object[$selectField] = $row[$fieldMap[$selectField]];
                    }
                    $models[$key][] = Model::fromSingle(TagType::type(), $object);
                }
                return $models;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                $key = $owner->type . ':' . $owner->id;
                return $objects[$key] ?? [];
            });
    }

    private function selectCountUsers()
    {
        return Medoo::raw(
            <<<EOT
                (
                    select count(*) from tag_users
                    where tag_id = tags.id
                )
                EOT
        );
    }
}
