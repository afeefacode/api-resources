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
                $filters = $request->getFilters();
                $usedFilters = [];

                $where = [
                    'ORDER' => 'id',
                    'LIMIT' => 15,
                    // 'id[>=]' => '199'
                    // 'id' => '10'
                ];

                $count = $db->count('articles');
                $countSearch = $count;

                $keyword = $filters['q'] ?? null;

                if ($keyword) {
                    $countSearch = $db->count('articles', [
                        'title[~]' => $keyword
                    ]);

                    $where['title[~]'] = $keyword;

                    $usedFilters['q'] = $keyword;
                }

                $pageFilter = $filters['page'] ?? null;

                if ($pageFilter) {
                    $page = $pageFilter['page'] ?? 1;
                    $pageSize = $pageFilter['page_size'] ?? 15;

                    [$offset, $pageSize, $page] = $this->pageToLimit($page, $pageSize, $countSearch);
                    $where['LIMIT'] = [$offset, $pageSize];

                    $usedFilters['page'] = [
                        'page' => $page,
                        'page_size' => $pageSize
                    ];
                }

                $objects = $db->select(
                    'articles',
                    $c->getSelectFields(),
                    $where
                );

                if ($objects === false) {
                    throw new ApiException(([
                        'error' => $db->error(),
                        'query' => $db->log()
                    ]));
                }

                $c->meta([
                    'count_scope' => $count,
                    'count_filter' => $count,
                    'count_search' => $countSearch,
                    'used_filters' => $usedFilters
                ]);

                return Model::fromList(ArticleType::$type, $objects);
            });
    }

    private function pageToLimit($page, $pageSize, $countAll)
    {
        $numPages = ceil($countAll / $pageSize);
        $page = max(1, min($numPages, $page));
        $offset = $pageSize * $page - $pageSize;
        return [$offset, $pageSize, $page];
    }

    public function resolve_articles_relation(RelationResolver $r, Medoo $db)
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
}
