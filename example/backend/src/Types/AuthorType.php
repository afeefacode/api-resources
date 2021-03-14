<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\VarcharField;
use Afeefa\ApiResources\Relation\RelationBag;
use Afeefa\ApiResources\Relation\Relations\HasMany;
use Afeefa\ApiResources\Relation\Relations\LinkMany;
use Afeefa\ApiResources\Type\Type;

class AuthorType extends Type
{
    public string $type = 'Example.Author';

    public function fields(FieldBag $fields): void
    {
        $fields->add('name', VarcharField::class);

        $fields->add('email', VarcharField::class);
    }

    public function relations(RelationBag $relations): void
    {
        $relations->add('articles', ArticleType::class, HasMany::class);

        $relations->add('tags', TagType::class, LinkMany::class);
    }
}
