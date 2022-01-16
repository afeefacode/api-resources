<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\HasManyRelation;
use Afeefa\ApiResources\Field\Fields\LinkManyRelation;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Type\ModelType;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validators\VarcharValidator;
use Backend\Resolvers\ArticlesResolver;
use Backend\Resolvers\TagsResolver;

class AuthorType extends ModelType
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
        $fields->attribute('name', VarcharAttribute::class);

        $fields->attribute('email', VarcharAttribute::class);

        $fields->relation('articles', ArticleType::class, function (HasManyRelation $relation) {
            $relation->resolve([ArticlesResolver::class, 'resolve_articles_relation']);
        });

        $fields->relation('tags', Type::list(TagType::class), function (LinkManyRelation $relation) {
            $relation->resolve([TagsResolver::class, 'resolve_tags_relation']);
        });
    }

    protected function updateFields(FieldBag $fields): void
    {
        $fields->get('name')
            ->validate(function (VarcharValidator $v) {
                $v
                    ->filled()
                    ->min(5)
                    ->max(101);
            });

        $fields->allow([
            'name'
        ]);
    }

    protected function createFields(FieldBag $fields): void
    {
        $fields->allow([
            'name'
        ]);
    }
}
