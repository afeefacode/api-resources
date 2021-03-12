<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateField;
use Afeefa\ApiResources\Field\Fields\VarcharField;
use Afeefa\ApiResources\Relation\RelationBag;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validators\VarcharValidator;

class ArticleType extends Type
{
    public string $type = 'Example.Article';

    public function fields(FieldBag $fields): void
    {
        $fields->add('title', VarcharField::class);

        $fields->add('summary', VarcharField::class);

        $fields->add('content', VarcharField::class);

        $fields->add('date', DateField::class);
    }

    public function updateFields(FieldBag $fields): void
    {
        $fields->get('title')
            ->required()
            ->validate(function (VarcharValidator $v) {
                $v
                    ->filled()
                    ->min(5)
                    ->max(100);
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
            'date'
        ]);
    }

    public function createFields(FieldBag $fields): void
    {
        $fields->get('title')
            ->required()
            ->validate(function (VarcharValidator $v) {
                $v->max(50);
            });

        $fields->allow([
            'title'
        ]);
    }

    public function relations(RelationBag $relations): void
    {
        $relations->linkOne('author', AuthorType::class);

        // $relations->linkOne('author', Author::class, function (Author $author) {
        //     $author->update(function (FieldBag $fields) {
        //         $fields->set([
        //             'title',
        //             'name'
        //         ]);

        //         $fields->delete('test');

        //         $fields->update('test')->required();
        //     });
        // });

        $relations->hasMany('comments', CommentType::class);

        $relations->linkMany('tags', TagType::class);
    }
}
