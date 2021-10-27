<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateAttribute;
use Afeefa\ApiResources\Field\Fields\LinkOneRelation;
use Afeefa\ApiResources\Field\Fields\TextAttribute;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Type\Type;

class CommentType extends Type
{
    protected static string $type = 'Example.CommentType';

    protected function fields(FieldBag $fields): void
    {
        $fields->attribute('author_name', VarcharAttribute::class);

        $fields->attribute('content', TextAttribute::class);

        $fields->attribute('date', DateAttribute::class);

        $fields->relation('article', ArticleType::class, LinkOneRelation::class);
    }
}
