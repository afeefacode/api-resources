<?php

namespace Backend\Types;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Field\Attribute;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validators\LinkOneValidator;
use Afeefa\ApiResources\Validator\Validators\StringValidator;
use Backend\Resolvers\AuthorsResolver;
use Backend\Resolvers\CommentsResolver;
use Backend\Resolvers\TagsResolver;
use Backend\Resources\AuthorResource;

class ArticleType extends Type
{
    protected static string $type = 'Example.Article';

    protected function fields(FieldBag $fields): void
    {
        $fields
            ->string('title')

            ->string('summary')

            ->string('content')

            ->date('date')

            ->hasOne('author', AuthorType::class, function (Relation $relation) {
                $relation->resolve([AuthorsResolver::class, 'resolve_author_relation']);
            })

            ->hasMany('comments', CommentType::class, function (Relation $relation) {
                $relation->resolve([CommentsResolver::class, 'resolve_comments_relation']);
            })

            ->hasMany('tags', TagType::class, function (Relation $relation) {
                $relation->resolve([TagsResolver::class, 'resolve_tags_relation']);
            });
    }

    protected function updateFields(FieldBag $updateFields): void
    {
        $updateFields
            ->string('title', validate: function (StringValidator $v) {
                $v
                    ->filled()
                    ->min(5)
                    ->max(101);
            })

            ->string('summary', validate: function (StringValidator $v) {
                $v
                    ->min(3)
                    ->max(200);
            })

            ->string('content')

            ->date('date')

            ->linkOne('author', AuthorType::class, function (Relation $relation) {
                $relation
                    ->required()
                    ->validate(function (LinkOneValidator $v) {
                        $v->filled();
                    })
                    ->resolve([AuthorsResolver::class, 'resolve_save_author_relation'])
                    ->optionsRequest(function (ApiRequest $request) {
                        $request
                            ->resourceType(AuthorResource::type())
                            ->actionName('get_authors')
                            ->fields(['name' => true, 'count_articles' => true])
                            ->filters(['page_size' => 100]);
                    });
            })

            ->linkMany('tags', TagType::class);
    }

    protected function createFields(FieldBag $createFields, FieldBag $updateFields): void
    {
        $createFields
            ->from($updateFields, 'title', function (Attribute $attribute) {
                $attribute->required();
            })

            ->from($updateFields, 'author', function (Relation $relation) {
                $relation->required();
            });
    }
}
