<?php

namespace Backend\Models;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Relation\RelationBag;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Validator\Validators\VarcharValidator;

class Article extends Model
{
    public string $type = 'Example.Article';

    public function updateFields(FieldBag $fields): void
    {
        $fields->id('id');

        $fields->varchar('title')
            ->min(5)
            ->max(100);

        $fields->varchar('summary')
            ->empty(true, null)
            ->min(3)
            ->max(100);

        $fields->text('content');

        $fields->date('date');
    }

    public function createFields(FieldBag $fields): void
    {
    }

    public function fields(FieldBag $fields): void
    {
        $fields->varchar('title')
            ->validate(function (VarcharValidator $v) {
                $v
                    ->min(5)
                    ->max(100);
            });

        $fields->varchar('summary');

        $fields->text('content');

        $fields->date('date');
    }

    public function relations(RelationBag $relations): void
    {
        $relations->linkOne('author', Author::class);

        $relations->hasMany('comments', Comment::class);

        $relations->linkMany('tags', Tag::class);
    }
}
