<?php

namespace Backend\Types;

use Afeefa\ApiResources\DB\GetRelationResolver;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateAttribute;
use Afeefa\ApiResources\Field\Fields\HasManyRelation;
use Afeefa\ApiResources\Field\Fields\LinkManyRelation;
use Afeefa\ApiResources\Field\Fields\LinkOneRelation;
use Afeefa\ApiResources\Field\Fields\TextAttribute;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Type\ModelType;
use Afeefa\ApiResources\Validator\Validators\LinkOneValidator;
use Afeefa\ApiResources\Validator\Validators\VarcharValidator;
use Backend\Resolvers\AuthorsResolver;
use Backend\Resolvers\CommentsResolver;
use Backend\Resolvers\TagsResolver;

class ArticleType extends ModelType
{
    public static string $type = 'Example.Article';

    protected function translations(): array
    {
        return [
            'TITLE_SINGULAR' => 'Artikel',
            'TITLE_PLURAL' => 'Artikel',
            'TITLE_EMPTY' => 'Kein Titel',
            'TITLE_NEW' => 'Neuer Artikel'
        ];
    }

    protected function fields(FieldBag $fields): void
    {
        $fields->attribute('title', VarcharAttribute::class);

        $fields->attribute('summary', TextAttribute::class);

        $fields->attribute('content', TextAttribute::class);

        $fields->attribute('date', DateAttribute::class);

        $fields->relation('author', AuthorType::class, function (LinkOneRelation $relation) {
            $relation->resolve([AuthorsResolver::class, 'resolve_author_relation']);
        });

        $fields->relation('author2', AuthorType::class, function (LinkOneRelation $relation) {
            $relation->resolve(function (GetRelationResolver $r) {
                $r
                    ->load(function () {
                        return Model::fromList('test', [
                            ['id' => '1', 'name' => 'jens'],
                            ['id' => '2', 'name' => 'jens2']
                        ]);
                    })
                    ->map(function ($models, $owner) {
                        return $models[0];
                    });
            });
        });

        // $relations->relation('author', AuthorType::class, function (LinkOneRelation $relation) {
        //     $relation->update(function (FieldBag $fields) {
        //         $fields->set([
        //             'title',
        //             'name'
        //         ]);

        //         $fields->delete('test');

        //         $fields->update('test')->required();
        //     });
        // });

        $fields->relation('comments', CommentType::class, function (HasManyRelation $relation) {
            $relation->resolve([CommentsResolver::class, 'resolve_comments_relation']);
        });

        $fields->relation('tags', TagType::class, function (LinkManyRelation $relation) {
            $relation->resolve([TagsResolver::class, 'resolve_tags_relation']);
        });
    }

    protected function updateFields(FieldBag $fields): void
    {
        $fields->get('title')
            ->validate(function (VarcharValidator $v) {
                $v
                    ->filled()
                    ->min(5)
                    ->max(101);
            });

        $fields->get('summary')
            ->validate(function (VarcharValidator $v) {
                $v
                    ->min(3)
                    ->max(200);
            });

        $fields->allow([
            'title',
            'summary',
            'content',
            'date',
            'tags',
            'author'
        ]);
    }

    protected function createFields(FieldBag $fields): void
    {
        $fields->get('title')
            ->required()
            ->validate(function (VarcharValidator $v) {
                $v->min(2);
                $v->max(50);
            });

        $fields->get('author')
            ->required()
            ->validate(function (LinkOneValidator $v) {
                $v->filled();
            });

        $fields->allow([
            'title',
            'author'
        ]);
    }
}
