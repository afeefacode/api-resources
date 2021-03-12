<?php

namespace Backend\Models;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\VarcharField;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Relation\RelationBag;

class Author extends Model
{
    public string $type = 'Example.Author';

    public function fields(FieldBag $fields): void
    {
        $fields->add('name', VarcharField::class);

        $fields->add('email', VarcharField::class);
    }

    public function relations(RelationBag $relations): void
    {
        $relations->hasMany('articles', Article::class);

        $relations->linkMany('tags', Tag::class);
    }
}
