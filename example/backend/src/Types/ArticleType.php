<?php

namespace Backend\Types;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Field\Attribute;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateAttribute;
use Afeefa\ApiResources\Field\Fields\LinkManyRelation;
use Afeefa\ApiResources\Field\Fields\TextAttribute;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validators\LinkOneValidator;
use Afeefa\ApiResources\Validator\Validators\VarcharValidator;
use Backend\Resolvers\AuthorsResolver;
use Backend\Resolvers\CommentsResolver;
use Backend\Resolvers\TagsResolver;
use Backend\Resources\AuthorResource;

class ArticleType extends Type
{
    protected static string $type = 'Example.Article';

    protected function translations(): array
    {
        return [
            'TITLE_SINGULAR' => 'Artikel',
            'TITLE_PLURAL' => 'Artikel',
            'TITLE_EMPTY' => 'Kein Titel',
            'TITLE_NEW' => 'Neuer Artikel'
        ];
    }

    protected function fields(FieldBag $fields): void
    {
        $fields->attribute('title', VarcharAttribute::class)

            ->attribute('summary', TextAttribute::class)

            ->attribute('content', TextAttribute::class)

            ->attribute('date', DateAttribute::class)

            ->relation('author', AuthorType::class, function (Relation $relation) {
                $relation->resolve([AuthorsResolver::class, 'resolve_author_relation']);
            })

            ->relation('comments', Type::list(CommentType::class), function (Relation $relation) {
                $relation->resolve([CommentsResolver::class, 'resolve_comments_relation']);
            })

            ->relation('tags', Type::list(TagType::class), function (Relation $relation) {
                $relation->resolve([TagsResolver::class, 'resolve_tags_relation']);
            });
    }

    protected function updateFields(FieldBag $updateFields): void
    {
        $updateFields
            ->attribute('title', function (VarcharAttribute $attribute) {
                $attribute
                    ->validate(function (VarcharValidator $v) {
                        $v
                            ->filled()
                            ->min(5)
                            ->max(101);
                    });
            })

            ->attribute('summary', function (TextAttribute $attribute) {
                $attribute
                    ->validate(function (VarcharValidator $v) {
                        $v
                            ->min(3)
                            ->max(200);
                    });
            })

            ->attribute('content', TextAttribute::class)

            ->attribute('date', DateAttribute::class)

            ->relation('author', Type::link(AuthorType::class), function (Relation $r) {
                $r
                    ->required()
                    ->validate(function (LinkOneValidator $v) {
                        $v->filled();
                    })
                    ->resolveSave([AuthorsResolver::class, 'resolve_save_author_relation'])
                    ->optionsRequest(function (ApiRequest $request) {
                        $request
                            ->resourceType(AuthorResource::type())
                            ->actionName('get_authors')
                            ->fields(['name' => true, 'count_articles' => true])
                            ->filters(['page_size' => 100]);
                    });
            })

            ->relation('tags', Type::list(Type::link(TagType::class)), function (LinkManyRelation $relation) {
            });
    }

    protected function createFields(FieldBag $createFields, FieldBag $updateFields): void
    {
        $createFields
            ->from($updateFields, 'author', function (Relation $relation) {
                $relation->required();
            })

            ->from($updateFields, 'title', function (Attribute $attribute) {
                $attribute->required();
            });
    }
}
