<?php

namespace Backend\Types;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\DateAttribute;
use Afeefa\ApiResources\Field\Fields\HasManyRelation;
use Afeefa\ApiResources\Field\Fields\LinkManyRelation;
use Afeefa\ApiResources\Field\Fields\LinkOneRelation;
use Afeefa\ApiResources\Field\Fields\TextAttribute;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Resolver\QueryRelationResolver;
use Afeefa\ApiResources\Type\ModelType;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Validator\Validators\LinkOneValidator;
use Afeefa\ApiResources\Validator\Validators\VarcharValidator;
use Backend\Resolvers\AuthorsResolver;
use Backend\Resolvers\CommentsResolver;
use Backend\Resolvers\TagsResolver;
use Backend\Resources\AuthorResource;

class ArticleType extends ModelType
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
        $fields->attribute('title', VarcharAttribute::class);

        $fields->attribute('summary', TextAttribute::class);

        $fields->attribute('content', TextAttribute::class);

        $fields->attribute('date', DateAttribute::class);

        $fields->relation('author', AuthorType::class, function (LinkOneRelation $relation) {
            $relation->resolve([AuthorsResolver::class, 'resolve_author_relation']);
        });

        $fields->relation('author2', AuthorType::class, function (LinkOneRelation $relation) {
            $relation->resolve(function (QueryRelationResolver $r) {
                $r
                    ->load(function () {
                        return Model::fromList('test', [
                            ['id' => '1', 'name' => 'jens'],
                            ['id' => '2', 'name' => 'jens2']
                        ]);
                    })
                    ->map(function ($models, $owner) {
                        return $models[0];
                    });
            });
        });

        // $relations->relation('author', AuthorType::class, function (LinkOneRelation $relation) {
        //     $relation->update(function (FieldBag $fields) {
        //         $fields->set([
        //             'title',
        //             'name'
        //         ]);

        //         $fields->delete('test');

        //         $fields->update('test')->required();
        //     });
        // });

        $fields->relation('comments', Type::list(CommentType::class), function (HasManyRelation $relation) {
            $relation->resolve([CommentsResolver::class, 'resolve_comments_relation']);
        });

        $fields->relation('tags', Type::list(TagType::class), function (LinkManyRelation $relation) {
            $relation->resolve([TagsResolver::class, 'resolve_tags_relation']);
        });
    }

    protected function updateFields(FieldBag $fields): void
    {
        $fields->get('title')
            ->validate(function (VarcharValidator $v) {
                $v
                    ->filled()
                    ->min(5)
                    ->max(101);
            });

        $fields->get('summary')
            ->validate(function (VarcharValidator $v) {
                $v
                    ->min(3)
                    ->max(200);
            });

        $fields->relation('author', Type::link(AuthorType::class), function (LinkOneRelation $r) {
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
        });

        $fields->allow([
            'title',
            'summary',
            'content',
            'date',
            'tags',
            'author'
        ]);
    }

    protected function createFields(FieldBag $fields): void
    {
        $fields->get('title')->required();

        $fields->get('author')->required();

        $fields->allow([
            'title',
            'author'
        ]);
    }
}
