<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Resolver\ActionResult;
use Afeefa\ApiResources\Resolver\MutationActionModelResolver;
use Afeefa\ApiResources\Resolver\MutationRelationLinkOneResolver;
use Afeefa\ApiResources\Resolver\QueryActionResolver;
use Afeefa\ApiResources\Resolver\QueryRelationResolver;
use Backend\Types\AuthorType;
use Closure;
use Medoo\Medoo;

class AuthorsResolver
{
    public function get_authors(QueryActionResolver $r, Medoo $db)
    {
        $r
            ->get(function (ApiRequest $request, Closure $getSelectFields) use ($db) {
                $selectFields = $getSelectFields();

                $usedFilters = [];
                $where = [];

                $countAll = $countFilters = $db->count('authors');

                // tag_id search

                $tagId = $request->getFilter('tag_id');

                if ($tagId) {
                    $where['EXISTS'] = $this->selectTagId($tagId);

                    $usedFilters['tag_id'] = $tagId;
                }

                if (count($usedFilters)) {
                    $countFilters = $this->getCount($db, $selectFields, $where);
                }

                $countSearch = $countFilters;

                // keyword search

                $keyword = $request->getFilter('q');

                if ($keyword) {
                    $where['name[~]'] = $keyword;

                    $countSearch = $this->getCount($db, $selectFields, $where);

                    $usedFilters['q'] = $keyword;
                }

                // pagination

                $page = $request->getFilter('page', 1);
                $pageSize = $request->getFilter('page_size');

                [$offset, $pageSize, $page] = $this->pageToLimit($page, $pageSize, $countSearch);
                $where['LIMIT'] = [$offset, $pageSize];

                $usedFilters['page'] = $page;
                $usedFilters['page_size'] = $pageSize;

                // order

                $order = $request->getFilter('order');

                foreach ($order as $field => $direction) {
                    if ($field === 'count_articles') {
                        if (!isset($selectFields['count_articles'])) {
                            $selectFields['count_articles'] = $this->selectCountArticles();
                        }
                    }

                    $where['ORDER'][$field] = strtoupper($direction);

                    $usedFilters['order'] = [
                        $field => $direction
                    ];
                }

                // select

                $objects = $db->select(
                    'authors',
                    $selectFields,
                    $where
                );

                return (new ActionResult())
                    ->data(Model::fromList(AuthorType::type(), $objects))

                    ->meta([
                        'count_all' => $countAll,
                        'count_filter' => $countFilters,
                        'count_search' => $countSearch,
                        'used_filters' => $usedFilters
                    ]);
            });
    }

    public function get_author(QueryActionResolver $r, Medoo $db)
    {
        $r
            ->get(function (ApiRequest $request, Closure $getSelectFields) use ($db) {
                $object = $db->get(
                    'authors',
                    $getSelectFields(),
                    ['id' => $request->getParam('id')]
                );

                return $object ? Model::fromSingle(AuthorType::type(), $object) : null;
            });
    }

    public function save_author(MutationActionModelResolver $r, Medoo $db)
    {
        $r
            ->get(function (string $id) use ($db) {
                $object = $db->get(
                    'authors',
                    '*',
                    ['id' => $id]
                );
                return Model::fromSingle(AuthorType::type(), $object);
            })

            ->add(function (string $typeName, array $saveFields) use ($db) {
                $db->insert(
                    'authors',
                    $saveFields
                );
                return Model::fromSingle(AuthorType::type(), ['id' => $db->id()]);
            })

            ->update(function (Model $author, array $saveFields) use ($db) {
                $db->update(
                    'authors',
                    $saveFields,
                    ['id' => $author->id]
                );
            })

            ->delete(function (Model $author) use ($db) {
                $db->delete(
                    'authors',
                    ['id' => $author->id]
                );
            })

            ->forward(function (ApiRequest $apiRequest, Model $author) {
                $apiRequest->param('id', $author->id);
                $apiRequest->actionName('get_author');
            });
    }

    public function resolve_author_relation(QueryRelationResolver $r, Medoo $db)
    {
        $r
            ->ownerIdFields(['author_id'])

            ->get(function (array $owners, Closure $getSelectFields) use ($db) {
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
                    $models[$row['id']] = Model::fromSingle(AuthorType::type(), $row);
                }
                return $models;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                return $objects[$owner->author_id] ?? null;
            });
    }

    public function resolve_save_author_relation(MutationRelationLinkOneResolver $r)
    {
        $r->saveRelatedToOwner(function (?string $id) {
            return ['author_id' => $id];
        });
    }

    private function selectTagId($tagId)
    {
        return Medoo::raw(
            <<<EOT
                (
                    select 1 from tag_users
                    where user_id = authors.id
                    and user_type = 'Example.Author'
                    and tag_id = {$tagId}
                )
                EOT
        );
    }

    private function getCount(Medoo $db, array $countSelectFields, array $where): int
    {
        $query = $db->sql(
            'authors',
            $countSelectFields,
            $where
        );

        return intval($db->query('SELECT COUNT(*) from (' . $query . ') tmp')->fetchColumn());
    }

    private function pageToLimit(int $page, int $pageSize, int $countAll): array
    {
        $numPages = ceil($countAll / $pageSize);
        $page = max(1, min($numPages, $page));
        $offset = $pageSize * $page - $pageSize;
        return [$offset, $pageSize, $page];
    }

    private function selectCountArticles()
    {
        return Medoo::raw(
            <<<EOT
                (
                    select count(*) from articles
                    where author_id = authors.id
                )
                EOT
        );
    }
}
