<?php

namespace Backend\Types;

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\TextAttribute;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Resolver\Mutation\MutationRelationResolver;
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

    protected function queryFields(FieldBag $get): void
    {
        $get
            ->attribute('title', VarcharAttribute::class)

            ->attribute('summary', TextAttribute::class)

            ->relation('author', AuthorType::class, function (Relation $relation) {
                $relation->resolve([AuthorsResolver::class, 'resolve_author_relation']);
            })

            ->relation('contents', Type::list(ContentType::class), function (Relation $relation) {
                $relation->resolve([ContentsResolver::class, 'get_contents_relation']);
            })

            ->relation('location', LocationType::class, function (Relation $relation) {
                $relation->resolve([LocationsResolver::class, 'get_location_relation']);
            })

            ->relation('comments', Type::list(CommentType::class), function (Relation $relation) {
                $relation->resolve([CommentsResolver::class, 'resolve_comments_relation']);
            })

            ->relation('tags', Type::list(TagType::class), function (Relation $relation) {
                $relation->resolve([TagsResolver::class, 'resolve_tags_relation']);
            });
    }

    protected function mutationFields(FieldBag $save): void
    {
        $save
            ->attribute('title', function (VarcharAttribute $a) {
                $a->validate(function (VarcharValidator $v) {
                    $v
                        ->filled()
                        ->min(5)
                        ->max(101);
                });
            })

            ->attribute('summary', function (TextAttribute $a) {
                $a->validate(function (VarcharValidator $v) {
                    $v
                        ->min(3)
                        ->max(200);
                });
            })

            ->relation('contents', Type::list(ContentType::class), function (Relation $relation) {
                $relation
                    ->resolve([ContentsResolver::class, 'save_contents_relation'], ['key' => 'value']);
            })

            ->relation('location', Type::link(ArticleType::class), function (Relation $relation) {
                $relation
                    ->required()
                    ->validate(function (LinkOneValidator $v) {
                        $v->filled();
                    })
                    ->resolve(function (MutationRelationResolver $r) {
                        $r->save(function ($owner, $data) {
                            if ($data) {
                                // link id
                            }
                            // set null
                        });
                        $r->link(function ($owner, $data) {
                        });
                        $r->unlink(function ($owner, $data) {
                        });
                    })
                    ->optionsRequest(function (ApiRequest $request) {
                        $request
                            ->resourceType(AuthorResource::type())
                            ->actionName('get_authors')
                            ->fields(['name' => true, 'count_articles' => true])
                            ->filters(['page_size' => 100]);
                    });
            })

            ->relation('location', Type::link(LocationType::class), function (Relation $relation) {
                $relation
                    ->validate(function (LinkOneValidator $v) {
                        $v->filled();
                    })
                    ->resolve([LocationsResolver::class, 'save_location_relation']);
            });

        $save->update([
            'title',
            'summary',
            'contents',
            'location'
        ]);

        $save->create([
            ['title', true],
            ['summary', true]
        ]);
    }

    // protected function updateFields2(FieldBag $fields): void
    // {
    //     $fields->get('title')
    //         ->validate(function (VarcharValidator $v) {
    //             $v
    //                 ->filled()
    //                 ->min(5)
    //                 ->max(101);
    //         });

    //     $fields->get('summary')
    //         ->validate(function (VarcharValidator $v) {
    //             $v
    //                 ->min(3)
    //                 ->max(200);
    //         });

    //     $fields->get('author')
    //         ->required()
    //         ->validate(function (LinkOneValidator $v) {
    //             $v->filled();
    //         })
    //         ->resolve([AuthorsResolver::class, 'resolve_save_author_relation'])
    //         ->optionsRequest(function (ApiRequest $request) {
    //             $request
    //                 ->resourceType(AuthorResource::type())
    //                 ->actionName('get_authors')
    //                 ->fields(['name' => true, 'count_articles' => true])
    //                 ->filters(['page_size' => 100]);
    //         });

    //     $fields->allow([
    //         'title',
    //         'summary',
    //         'content',
    //         'date',
    //         'tags',
    //         'author'
    //     ]);
    // }

    // protected function createFields2(FieldBag $fields): void
    // {
    //     $fields->get('title')->required();

    //     $fields->get('author')->required();

    //     $fields->allow([
    //         'title',
    //         'author'
    //     ]);
    // }
}
