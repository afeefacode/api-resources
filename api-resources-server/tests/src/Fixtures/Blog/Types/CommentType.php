<?php

namespace Afeefa\ApiResources\Test\Fixtures\Blog\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateAttribute;
use Afeefa\ApiResources\Field\Fields\StringAttribute;
use Afeefa\ApiResources\Type\Type;

class CommentType extends Type
{
    protected static string $type = 'Blog.CommentType';

    protected function fields(FieldBag $fields): void
    {
        $fields
            ->attribute('author_name', StringAttribute::class)

            ->attribute('content', StringAttribute::class)

            ->attribute('date', DateAttribute::class)

            ->relation('article', ArticleType::class);
    }
}
