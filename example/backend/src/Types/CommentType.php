<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateAttribute;
use Afeefa\ApiResources\Field\Fields\TextAttribute;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Type\Type;

class CommentType extends Type
{
    protected static string $type = 'Example.CommentType';

    protected function fields(FieldBag $fields): void
    {
        $fields
            ->attribute('author_name', VarcharAttribute::class)

            ->attribute('content', TextAttribute::class)

            ->attribute('date', DateAttribute::class)

            ->relation('article', ArticleType::class);
    }
}
