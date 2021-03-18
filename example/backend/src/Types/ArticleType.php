<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateField;
use Afeefa\ApiResources\Field\Fields\VarcharField;
use Afeefa\ApiResources\Relation\RelationBag;
use Afeefa\ApiResources\Relation\Relations\HasMany;
use Afeefa\ApiResources\Relation\Relations\LinkMany;
use Afeefa\ApiResources\Relation\Relations\LinkOne;
use Afeefa\ApiResources\Type\ModelType;
use Afeefa\ApiResources\Validator\Validators\VarcharValidator;

class ArticleType extends ModelType
{
    public static string $type = 'Example.Article';

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
        // $relations->add('author', AuthorType::class, function (LinkOne $relation) {
        //     $author->update(function (FieldBag $fields) {
        //         $fields->set([
        //             'title',
        //             'name'
        //         ]);

        //         $fields->delete('test');

        //         $fields->update('test')->required();
        //     });
        // });

        $relations->add('author', AuthorType::class, LinkOne::class);

        $relations->add('comments', CommentType::class, HasMany::class);

        $relations->add('tags', TagType::class, LinkMany::class);
    }
}
