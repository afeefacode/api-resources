<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\ActionResolver;
use Afeefa\ApiResources\DB\RelationResolver;
use Afeefa\ApiResources\DB\ResolveContext;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Backend\Types\AuthorType;
use Medoo\Medoo;

class AuthorsResolver
{
    public function get_authors(ActionResolver $r, Medoo $db)
    {
        $r
            ->load(function (ResolveContext $c) use ($r, $db) {
                $request = $r->getRequest();
                $requestedFields = $request->getFields();
                $filters = $request->getFilters();
                $selectFields = $c->getSelectFields();

                $usedFilters = [];
                $where = [];

                $countScope = $countFilters = $db->count('authors');

                // tag_id search

                $tagId = $filters['tag_id'] ?? null;

                if ($tagId) {
                    $where['EXISTS'] = $this->selectTagId($tagId);

                    $usedFilters['tag_id'] = $tagId;
                }

                if (count($usedFilters)) {
                    $countFilters = $this->getCount($db, $selectFields, $where);
                }

                $countSearch = $countFilters;

                // keyword search

                $keyword = $filters['q'] ?? null;

                if ($keyword) {
                    $where['name[~]'] = $keyword;

                    $countSearch = $this->getCount($db, $selectFields, $where);

                    $usedFilters['q'] = $keyword;
                }

                // pagination

                $pageSizeFilter = $r->getAction()->getFilter('page_size');

                $page = $filters['page'] ?? 1;
                $pageSize = $filters['page_size'] ?? $pageSizeFilter->getDefaultValue();

                [$offset, $pageSize, $page] = $this->pageToLimit($page, $pageSize, $countSearch);
                $where['LIMIT'] = [$offset, $pageSize];

                $usedFilters['page'] = $page;
                $usedFilters['page_size'] = $pageSize;

                // count articles

                if ($requestedFields->hasField('count_articles')) {
                    if (!isset($selectFields['count_articles'])) {
                        $selectFields['count_articles'] = $this->selectCountArticles();
                    }
                }

                // order

                $oderFilter = $r->getAction()->getFilter('order');
                $order = $filters['order'] ?? $oderFilter->getDefaultValue() ?? [];

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

                $c->meta([
                    'count_scope' => $countScope,
                    'count_filter' => $countFilters,
                    'count_search' => $countSearch,
                    'used_filters' => $usedFilters
                ]);

                return Model::fromList(AuthorType::$type, $objects);
            });
    }

    public function get_author(ActionResolver $r, Medoo $db)
    {
        $r
            ->load(function (ResolveContext $c) use ($r, $db) {
                $request = $r->getRequest();
                $requestedFields = $request->getFields();
                $selectFields = $c->getSelectFields();

                $where = ['id' => $request->getParam('id')];

                // count articles

                if ($requestedFields->hasField('count_articles')) {
                    if (!isset($selectFields['count_articles'])) {
                        $selectFields['count_articles'] = $this->selectCountArticles();
                    }
                }

                // select

                $object = $db->get(
                    'authors',
                    $selectFields,
                    $where
                );

                return Model::fromSingle(AuthorType::$type, $object);
            });
    }

    public function resolve_author_relation(RelationResolver $r, Medoo $db)
    {
        $r
            ->ownerIdFields(['author_id'])

            ->load(function (array $owners, ResolveContext $c) use ($db) {
                /** @var ModelInterface[] $owners */
                $authorIds = array_unique(
                    array_map(function (ModelInterface $owner) {
                        return $owner->author_id;
                    }, $owners)
                );

                $result = $db->select(
                    'authors',
                    $c->getSelectFields(),
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

    private function selectTagId($tagId)
    {
        return Medoo::raw(
            <<<EOT
                (
                    select 1 from tag_users
                    where user_id = authors.id
                    and user_type = 'Example.AuthorType'
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
