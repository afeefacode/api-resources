<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\StringAttribute;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validators\StringValidator;
use Backend\Resolvers\ArticlesResolver;
use Backend\Resolvers\TagsResolver;

class AuthorType extends Type
{
    protected static string $type = 'Example.Author';

    protected function translations(): array
    {
        return [
            'TITLE_SINGULAR' => 'Autor:in',
            'TITLE_PLURAL' => 'Autor:innen',
            'TITLE_EMPTY' => 'Kein Name',
            'TITLE_NEW' => 'Neue Autor:in'
        ];
    }

    protected function fields(FieldBag $fields): void
    {
        $fields
            ->attribute('name', StringAttribute::class)

            ->attribute('email', StringAttribute::class)

            ->relation('articles', ArticleType::class, function (Relation $relation) {
                $relation->resolve([ArticlesResolver::class, 'resolve_articles_relation']);
            })

            ->relation('tags', Type::list(TagType::class), function (Relation $relation) {
                $relation->resolve([TagsResolver::class, 'resolve_tags_relation']);
            });
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
