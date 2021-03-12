<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateField;
use Afeefa\ApiResources\Field\Fields\TextField;
use Afeefa\ApiResources\Field\Fields\VarcharField;
use Afeefa\ApiResources\Relation\RelationBag;
use Afeefa\ApiResources\Type\Type;

class CommentType extends Type
{
    public string $type = 'Example.Comment';

    public function fields(FieldBag $fields): void
    {
        $fields->add('author_name', VarcharField::class);

        $fields->add('content', TextField::class);

        $fields->add('date', DateField::class);
    }

    public function relations(RelationBag $relations): void
    {
        $relations->linkOne('article', ArticleType::class);
    }
}
