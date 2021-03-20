<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\HasManyRelation;
use Afeefa\ApiResources\Field\Fields\LinkManyRelation;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Type\Type;

class AuthorType extends Type
{
    public static string $type = 'Example.AuthorType';

    protected function fields(FieldBag $fields): void
    {
        $fields->attribute('name', VarcharAttribute::class);

        $fields->attribute('email', VarcharAttribute::class);

        $fields->relation('articles', ArticleType::class, HasManyRelation::class);

        $fields->relation('tags', TagType::class, LinkManyRelation::class);
    }
}
