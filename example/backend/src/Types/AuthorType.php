<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validators\StringValidator;
use Backend\Resolvers\ArticlesResolver;
use Backend\Resolvers\TagsResolver;

class AuthorType extends Type
{
    protected static string $type = 'Example.Author';

    protected function fields(FieldBag $fields): void
    {
        $fields
            ->string('name')

            ->string('email')

            ->hasMany('articles', ArticleType::class, function (Relation $relation) {
                $relation
                    ->restrictTo(Relation::RESTRICT_TO_COUNT)
                    ->resolve([ArticlesResolver::class, 'resolve_articles_relation']);
            })

            ->hasMany('tags', TagType::class, function (Relation $relation) {
                $relation->resolve([TagsResolver::class, 'resolve_tags_relation']);
            });
    }

    protected function updateFields(FieldBag $updateFields): void
    {
        $updateFields
            ->string('name', validate: function (StringValidator $v) {
                $v
                    ->filled()
                    ->min(5)
                    ->max(101);
            });
    }

    protected function createFields(FieldBag $createFields, FieldBag $updateFields): void
    {
        $createFields->from($updateFields, 'name');
    }
}
