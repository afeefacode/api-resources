<?php

namespace Afeefa\ApiResources\Test\Fixtures\Blog\Types;

use Afeefa\ApiResources\Eloquent\ModelType;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\StringAttribute;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Test\Fixtures\Blog\Models\Author;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validators\StringValidator;

class AuthorType extends ModelType
{
    protected static string $type = 'Blog.Author';

    public static string $ModelClass = Author::class;

    protected function fields(FieldBag $fields): void
    {
        $fields
            ->attribute('name', StringAttribute::class)

            ->attribute('email', StringAttribute::class)

            ->relation('articles', Type::list(ArticleType::class), function (Relation $relation) {
                $relation
                    ->restrictTo(Relation::RESTRICT_TO_COUNT);
            })

            ->relation('tags', Type::list(TagType::class));
    }

    protected function updateFields(FieldBag $updateFields): void
    {
        $updateFields->attribute('name', function (StringAttribute $attribute) {
            $attribute->validate(function (StringValidator $v) {
                $v
                    ->filled()
                    ->min(5)
                    ->max(101);
            });
        });
    }

    protected function createFields(FieldBag $createFields, FieldBag $updateFields): void
    {
        $createFields->from($updateFields, 'name');
    }
}