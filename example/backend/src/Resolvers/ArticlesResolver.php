<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\ActionResolver;
use Afeefa\ApiResources\DB\RelationResolver;
use Afeefa\ApiResources\DB\ResolveContext;
use Afeefa\ApiResources\Exception\Exceptions\ApiException;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Backend\Types\ArticleType;
use Medoo\Medoo;

class ArticlesResolver
{
    public function get_articles(ActionResolver $r, Medoo $db)
    {
        $r
            ->load(function (ResolveContext $c) use ($r, $db) {
                $request = $r->getRequest();
                $requestedFields = $request->getFields();
                $filters = $request->getFilters();

                $selectFields = array_map(function ($field) {
                    return 'articles.' . $field;
                }, $c->getSelectFields());

                $countSelectFields = [];

                $usedFilters = [];

                $where = [];

                $countScope = $countFilters = $db->count('articles');

                // has comments

                $hasComments = array_key_exists('has_comments', $filters);

                if ($hasComments) {
                    $hasComments = $filters['has_comments'];

                    $this->selectCountComments($selectFields, $countSelectFields);

                    $where['GROUP'] = ['id']; // medoo requires group with having
                    $operator = $hasComments ? '[>]' : '';
                    $where['HAVING'] = [
                        'count_comments' . $operator => 0
                    ];

                    $countFilters = $this->getCount($db, $countSelectFields, $where);
                }

                $countSearch = $countFilters;

                // keyword search

                $keyword = $filters['q'] ?? null;

                if ($keyword) {
                    $where['title[~]'] = $keyword;

                    $countSearch = $this->getCount($db, $countSelectFields, $where);

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

                // order

                $oderFilter = $r->getAction()->getFilter('order');
                $order = $filters['order'] ?? $oderFilter->getDefaultValue() ?? [];

                foreach ($order as $field => $direction) {
                    if ($field === 'count_comments') {
                        if (!isset($selectFields['count_comments'])) {
                            $this->selectCountComments($selectFields, $countSelectFields);
                        }
                    }

                    $where['ORDER'][$field] = strtoupper($direction);

                    $usedFilters['order'] = [
                        $field => $direction
                    ];
                }
                // count comments

                if ($requestedFields->hasField('count_comments')) {
                    if (!isset($selectFields['count_comments'])) {
                        $this->selectCountComments($selectFields, $countSelectFields);
                    }
                }

                // select

                $objects = $db->select(
                    'articles',
                    $selectFields,
                    $where
                );

                if ($objects === false) {
                    throw new ApiException(([
                        'error' => $db->error(),
                        'query' => $db->log()
                    ]));
                }

                $c->meta([
                    'count_scope' => $countScope,
                    'count_filter' => $countFilters,
                    'count_search' => $countSearch,
                    'used_filters' => $usedFilters
                ]);

                return Model::fromList(ArticleType::$type, $objects);
            });
    }

    public function resolve_articles_relation(RelationResolver $r, Medoo $db): void
    {
        $r
            ->load(function (array $owners, ResolveContext $c) use ($db) {
                /** @var ModelInterface[] $owners */
                $selectFields = array_merge($c->getSelectFields(), ['author_id']);

                $authorIds = array_unique(
                    array_map(function (ModelInterface $owner) {
                        return $owner->id;
                    }, $owners)
                );

                $result = $db->select(
                    'articles',
                    $selectFields,
                    [
                        'author_id' => $authorIds,
                        'ORDER' => [
                            'date' => 'DESC'
                        ]
                    ]
                );

                $objects = [];
                foreach ($result as $row) {
                    $key = 'Author:' . $row['author_id'];
                    $objects[$key][] = Model::fromSingle(ArticleType::$type, $row);
                }
                return $objects;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                $key = $owner->id;
                return $objects['Author:' . $key];
            });
    }

    private function getCount($db, $countSelectFields, $where): int
    {
        $query = $db->sql(
            'articles',
            $countSelectFields,
            $where
        );

        return intval($db->query('SELECT COUNT(*) from (' . $query . ') tmp')->fetchColumn());
    }

    private function selectCountComments(array &$selectFields, array &$countSelectFields): void
    {
        $selectFields['count_comments'] = Medoo::raw(
            <<<EOT
                (
                    select count(*) from comments
                    where owner_id = articles.id
                    and owner_type = 'Example.ArticleType'
                )
                EOT
        );

        $countSelectFields['count_comments'] = $selectFields['count_comments'];
    }

    private function pageToLimit($page, $pageSize, $countAll): array
    {
        $numPages = ceil($countAll / $pageSize);
        $page = max(1, min($numPages, $page));
        $offset = $pageSize * $page - $pageSize;
        return [$offset, $pageSize, $page];
    }
}
