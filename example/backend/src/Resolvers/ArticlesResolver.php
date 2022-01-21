<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Exception\Exceptions\ApiException;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Resolver\MutationActionModelResolver;
use Afeefa\ApiResources\Resolver\QueryActionResolver;
use Afeefa\ApiResources\Resolver\QueryRelationResolver;
use Backend\Types\ArticleType;
use Medoo\Medoo;

class ArticlesResolver
{
    public function get_articles(QueryActionResolver $r, Medoo $db)
    {
        $r
            ->load(function () use ($r, $db) {
                $request = $r->getRequest();
                $action = $request->getAction();
                $requestedFieldNames = $r->getRequestedFieldNames();
                $filters = $request->getFilters();
                $params = $request->getParams();

                $selectFields = array_map(function ($field) {
                    return 'articles.' . $field;
                }, $r->getSelectFields());

                $usedFilters = [];

                $where = [];

                // author_id

                $authorId = $params['author_id'] ?? null;

                if ($authorId) {
                    $where['author_id'] = $authorId;
                    $countAll = $countFilters = $this->getCount($db, $selectFields, $where);
                } else {
                    $countAll = $countFilters = $db->count('articles');
                }

                // author_id search

                $authorId = $filters['author_id'] ?? null;

                if ($authorId) {
                    $where['author_id'] = $authorId;

                    $usedFilters['author_id'] = $authorId;
                }

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
                    $where['title[~]'] = $keyword;

                    $countSearch = $this->getCount($db, $selectFields, $where);

                    $usedFilters['q'] = $keyword;
                }

                // pagination

                $pageSizeFilter = $action->getFilter('page_size');

                $page = $filters['page'] ?? 1;
                $pageSize = $filters['page_size'] ?? $pageSizeFilter->getDefaultValue();

                [$offset, $pageSize, $page] = $this->pageToLimit($page, $pageSize, $countSearch);
                $where['LIMIT'] = [$offset, $pageSize];

                $usedFilters['page'] = $page;
                $usedFilters['page_size'] = $pageSize;

                // order

                $oderFilter = $action->getFilter('order');
                $order = $filters['order'] ?? $oderFilter->getDefaultValue() ?? [];

                foreach ($order as $field => $direction) {
                    if ($field === 'count_comments') {
                        if (!isset($selectFields['count_comments'])) {
                            $selectFields['count_comments'] = $this->selectCountComments();
                        }
                    }

                    if ($field === 'author_name') {
                        if (!isset($selectFields['author_name'])) {
                            $selectFields['author_name'] = $this->selectAuthorName();
                        }
                    }

                    $where['ORDER'][$field] = strtoupper($direction);

                    $usedFilters['order'] = [
                        $field => $direction
                    ];
                }

                // count comments

                if (in_array('count_comments', $requestedFieldNames)) {
                    if (!isset($selectFields['count_comments'])) {
                        $selectFields['count_comments'] = $this->selectCountComments();
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
                        'error' => $db->error,
                        'query' => $db->log()
                    ]));
                }

                $r->meta([
                    'count_all' => $countAll,
                    'count_filter' => $countFilters,
                    'count_search' => $countSearch,
                    'used_filters' => $usedFilters
                ]);

                return Model::fromList(ArticleType::type(), $objects);
            });
    }

    public function get_article(QueryActionResolver $r, Medoo $db)
    {
        $r
            ->load(function () use ($r, $db) {
                $request = $r->getRequest();
                $requestedFieldNames = $r->getRequestedFieldNames();
                $selectFields = $r->getSelectFields();

                $where = ['id' => $request->getParam('id')];

                // count comments

                if (in_array('count_comments', $requestedFieldNames)) {
                    if (!isset($selectFields['count_comments'])) {
                        $selectFields['count_comments'] = $this->selectCountComments();
                    }
                }

                // select

                $object = $db->get(
                    'articles',
                    $selectFields,
                    $where
                );

                return $object ? Model::fromSingle(ArticleType::type(), $object) : null;
            });
    }

    public function save_article(MutationActionModelResolver $r, Medoo $db)
    {
        $r
            ->get(function (string $id) use ($db) {
                $object = $db->get(
                    'articles',
                    '*',
                    ['id' => $id]
                );
                return Model::fromSingle(ArticleType::type(), $object);
            })

            ->add(function (string $typeName, array $saveFields) use ($db) {
                $saveFields['date'] = date('Y-m-d H:i:s');

                $db->insert(
                    'articles',
                    $saveFields
                );
                return Model::fromSingle(ArticleType::type(), ['id' => $db->id()]);
            })

            ->update(function (Model $article, array $saveFields) use ($db) {
                $db->update(
                    'articles',
                    $saveFields,
                    ['id' => $article->id]
                );
            })

            ->delete(function (Model $article) use ($db) {
                $db->delete(
                    'articles',
                    ['id' => $article->id]
                );
            })

            ->forward(function (ApiRequest $apiRequest, Model $article) {
                $apiRequest->param('id', $article->id);
                $apiRequest->actionName('get_article');
            });
    }

    public function resolve_articles_relation(QueryRelationResolver $r, Medoo $db): void
    {
        $r
            ->load(function (array $owners) use ($r, $db) {
                /** @var ModelInterface[] $owners */
                $selectFields = array_merge($r->getSelectFields(), ['author_id']);

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
                    $objects[$key][] = Model::fromSingle(ArticleType::type(), $row);
                }
                return $objects;
            })

            ->map(function (array $objects, ModelInterface $owner) {
                $key = $owner->id;
                return $objects['Author:' . $key] ?? [];
            });
    }

    private function getCount(Medoo $db, array $countSelectFields, array $where): int
    {
        $query = $db->sql(
            'articles',
            $countSelectFields,
            $where
        );

        return intval($db->query('SELECT COUNT(*) from (' . $query . ') tmp')->fetchColumn());
    }

    private function selectAuthorName()
    {
        return Medoo::raw(
            <<<EOT
                (
                    select name from authors
                    where id = articles.author_id
                )
                EOT
        );
    }

    private function selectCountComments()
    {
        return Medoo::raw(
            <<<EOT
                (
                    select count(*) from comments
                    where owner_id = articles.id
                    and owner_type = 'Example.Article'
                )
                EOT
        );
    }

    private function selectTagId($tagId)
    {
        return Medoo::raw(
            <<<EOT
                (
                    select 1 from tag_users
                    where user_id = articles.id
                    and user_type = 'Example.Article'
                    and tag_id = {$tagId}
                )
                EOT
        );
    }

    private function pageToLimit(int $page, int $pageSize, int $countAll): array
    {
        $numPages = ceil($countAll / $pageSize);
        $page = max(1, min($numPages, $page));
        $offset = $pageSize * $page - $pageSize;
        return [$offset, $pageSize, $page];
    }
}
