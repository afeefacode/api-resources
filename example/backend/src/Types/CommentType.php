<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Type\Type;

class CommentType extends Type
{
    protected static string $type = 'Example.CommentType';

    protected function fields(FieldBag $fields): void
    {
        $fields
            ->string('author_name')

            ->string('content')

            ->date('date')

            ->hasOne('article', ArticleType::class);
    }
}
