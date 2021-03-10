<?php

namespace Backend\Models;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Relation\RelationBag;

class Author extends Model
{
    public string $type = 'Example.Author';

    public function fields(FieldBag $fields): void
    {
        $fields->varchar('name');

        $fields->varchar('email');
    }

    public function relations(RelationBag $relations): void
    {
        $relations->hasMany('articles', Article::class);

        $relations->linkMany('tags', Tag::class);
    }
}
