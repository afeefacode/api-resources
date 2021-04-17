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
                $selectFields = $c->getSelectFields();

                $count = $db->count('authors');

                if ($requestedFields->hasField('count_articles')) {
                    if (!isset($selectFields['count_articles'])) {
                        $selectFields['count_articles'] = $this->selectCountArticles();
                    }
                }

                $objects = $db->select(
                    'authors',
                    $selectFields
                );

                $c->meta([
                    'count_scope' => $count,
                    'count_filter' => $count,
                    'count_search' => $count
                ]);

                return Model::fromList(AuthorType::$type, $objects);
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
