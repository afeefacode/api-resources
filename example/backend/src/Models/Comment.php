<?php

namespace Backend\Models;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Relation\RelationBag;

class Comment extends Model
{
    public string $type = 'Example.Comment';

    public function fields(FieldBag $fields): void
    {
        $fields->varchar('author_name');

        $fields->text('content');

        $fields->date('date');
    }

    public function relations(RelationBag $relations): void
    {
        $relations->linkOne('article', Article::class);
    }
}
