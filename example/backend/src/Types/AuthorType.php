<?php

namespace Backend\Types;

use Afeefa\ApiResources\DB\Medoo\B_a_id_Resolver;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\HasManyRelation;
use Afeefa\ApiResources\Field\Fields\LinkManyRelation;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Type\Type;
use Backend\Resolvers\TagsResolver;

class AuthorType extends Type
{
    public static string $type = 'Example.AuthorType';

    protected function fields(FieldBag $fields): void
    {
        $fields->attribute('name', VarcharAttribute::class);

        $fields->attribute('email', VarcharAttribute::class);

        $fields->relation('articles', ArticleType::class, function (HasManyRelation $relation) {
            $relation->resolve(function (B_a_id_Resolver $r) {
                $r
                    ->aIdFieldName('author_id')
                    ->typeClass(ArticleType::class);
            });
        });

        $fields->relation('tags', TagType::class, function (LinkManyRelation $relation) {
            $relation->resolve([TagsResolver::class, 'resolve_tags_relation']);
        });
    }
}
