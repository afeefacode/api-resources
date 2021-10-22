<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\ActionResolver;
use Afeefa\ApiResources\DB\GetRelationResolver;
use Afeefa\ApiResources\DB\ResolveContext;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Backend\Types\TagType;
use Medoo\Medoo;

class TagsResolver
{
    public function get_tags(ActionResolver $r, Medoo $db)
    {
        $r
            ->load(function (ResolveContext $c) use ($r, $db) {
                $request = $r->getRequest();
                $requestedFields = $request->getFields();
                $selectFields = $c->getSelectFields();

                $count = $db->count('tags');

                if ($requestedFields->hasField('count_users')) {
                    if (!isset($selectFields['count_users'])) {
                        $selectFields['count_users'] = $this->selectCountUsers();
                    }
                }

                $objects = $db->select(
                    'tags',
                    $selectFields
                );

                $c->meta([
                    'count_scope' => $count,
                    'count_filter' => $count,
                    'count_search' => $count
                ]);

                return Model::fromList(TagType::$type, $objects);
            });
    }

    public function resolve_tag_users_relation(GetRelationResolver $r, Medoo $db)
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
                    $table = $typeName === 'Example.Article' ? 'articles' : 'authors';

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
                return $objects[$key] ?? [];
            });
    }

    public function resolve_tags_relation(GetRelationResolver $r, Medoo $db)
    {
        $r
            ->load(function (array $owners, ResolveContext $c) use ($db) {
                $requestedFields = $c->getRequestedFields();
                $selectFields = $c->getSelectFields();

                $queryFields = ['tag_users.user_id', 'tag_users.user_type'];

                /** @var ModelInterface[] $owners */
                $fieldMap = [];
                foreach ($selectFields as $selectField) {
                    $alias = "tag_{$selectField}";
                    $fieldMap[$selectField] = $alias;
                    $queryFields[] = "tags.{$selectField}({$alias})";
                }

                if ($requestedFields->hasField('count_users')) {
                    $alias = 'tag_users_count_users';
                    $fieldMap['count_users'] = $alias;
                    $queryFields[$alias] = $this->selectCountUsers();
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
                    $models[$key][] = Model::fromSingle(TagType::$type, $object);
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
