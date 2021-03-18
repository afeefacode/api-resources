<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateField;
use Afeefa\ApiResources\Field\Fields\TextField;
use Afeefa\ApiResources\Field\Fields\VarcharField;
use Afeefa\ApiResources\Relation\RelationBag;
use Afeefa\ApiResources\Relation\Relations\LinkOne;
use Afeefa\ApiResources\Type\Type;

class CommentType extends Type
{
    public static string $type = 'Example.Comment';

    public function fields(FieldBag $fields): void
    {
        $fields->add('author_name', VarcharField::class);

        $fields->add('content', TextField::class);

        $fields->add('date', DateField::class);
    }

    public function relations(RelationBag $relations): void
    {
        $relations->add('article', ArticleType::class, LinkOne::class);
    }
}
