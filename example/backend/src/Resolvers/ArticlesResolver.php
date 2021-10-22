<?php

namespace Backend\Resolvers;

use Afeefa\ApiResources\DB\ActionResolver;
use Afeefa\ApiResources\DB\GetRelationResolver;
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
                $scopes = $request->getScopes();

                $selectFields = array_map(function ($field) {
                    return 'articles.' . $field;
                }, $c->getSelectFields());

                $usedFilters = [];

                $where = [];

                // author_id scope

                $authorId = $scopes['author_id'] ?? null;

                if ($authorId) {
                    $where['author_id'] = $authorId;
                    $countScope = $countFilters = $this->getCount($db, $selectFields, $where);
                } else {
                    $countScope = $countFilters = $db->count('articles');
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

                if ($requestedFields->hasField('count_comments')) {
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

    public function get_article(ActionResolver $r, Medoo $db)
    {
        $r
            ->load(function (ResolveContext $c) use ($r, $db) {
                $request = $r->getRequest();
                $requestedFields = $request->getFields();
                $selectFields = $c->getSelectFields();

                $where = ['id' => $request->getParam('id')];

                // count comments

                if ($requestedFields->hasField('count_comments')) {
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

                if ($object === false) {
                    throw new ApiException(([
                        'error' => $db->error(),
                        'query' => $db->log()
                    ]));
                }

                return Model::fromSingle(ArticleType::$type, $object);
            });
    }

    public function update_article(ActionResolver $r, Medoo $db)
    {
        $r
            ->load(function () use ($r, $db) {
                $request = $r->getRequest();

                $data = $request->getData();
                $where = ['id' => $request->getParam('id')];

                $stmt = $db->update(
                    'articles',
                    $data,
                    $where
                );

                if ($stmt->errorCode() !== '00000') {
                    throw new ApiException(([
                        'error' => $db->error(),
                        'query' => $db->log()
                    ]));
                }

                return [];
            });
    }

    public function create_article(ActionResolver $r, Medoo $db)
    {
        $r
            ->load(function () use ($r, $db) {
                $request = $r->getRequest();

                $data = $request->getData();

                $stmt = $db->insert(
                    'articles',
                    $data
                );

                if ($stmt->errorCode() !== '00000') {
                    throw new ApiException(([
                        'error' => $db->error(),
                        'query' => $db->log()
                    ]));
                }

                return Model::fromSingle(ArticleType::$type, [
                    'id' => $db->id()
                ]);
            });
    }

    public function resolve_articles_relation(GetRelationResolver $r, Medoo $db): void
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
                    and owner_type = 'Example.ArticleType'
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
                    and user_type = 'Example.ArticleType'
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
