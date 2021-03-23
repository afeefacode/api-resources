<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateAttribute;
use Afeefa\ApiResources\Field\Fields\HasManyRelation;
use Afeefa\ApiResources\Field\Fields\LinkManyRelation;
use Afeefa\ApiResources\Field\Fields\LinkOneRelation;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Type\ModelType;
use Afeefa\ApiResources\Validator\Validators\VarcharValidator;
use Backend\Resolvers\AuthorsResolver;

class ArticleType extends ModelType
{
    public static string $type = 'Example.ArticleType';

    protected function fields(FieldBag $fields): void
    {
        $fields->attribute('title', VarcharAttribute::class);

        $fields->attribute('summary', VarcharAttribute::class);

        $fields->attribute('content', VarcharAttribute::class);

        $fields->attribute('date', DateAttribute::class);

        $fields->relation('author', AuthorType::class, function (LinkOneRelation $relation) {
            $relation->resolver([AuthorsResolver::class, 'get_author_relation']);
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

        $fields->relation('comments', CommentType::class, HasManyRelation::class);

        $fields->relation('tags', TagType::class, LinkManyRelation::class);
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
                    ->max(100);
            });

        $fields->allow([
            'title',
            'summary',
            'content',
            'date',
            'tags'
        ]);
    }

    protected function createFields(FieldBag $fields): void
    {
        $fields->get('title')
            ->required()
            ->validate(function (VarcharValidator $v) {
                $v->min(20);
                $v->max(50);
            });

        $fields->get('author')
            ->required();

        $fields->allow([
            'title',
            'author'
        ]);
    }
}
