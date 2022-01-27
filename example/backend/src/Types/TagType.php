<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\StringAttribute;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Type\Type;
use Backend\Resolvers\TagsResolver;

class TagType extends Type
{
    protected static string $type = 'Example.TagType';

    protected function fields(FieldBag $fields): void
    {
        $fields
            ->attribute('name', StringAttribute::class)

            ->relation('users', [AuthorType::class, ArticleType::class], function (Relation $relation) {
                $relation->resolve([TagsResolver::class, 'resolve_tag_users_relation']);
            });
    }
}

// tags: {
//     fields: [
//         'name',
//         {
//             users: [
//                 id, type, {
//                     'Example.Article': [name, title, summary],
//                     'Example.Author': [name, password]
//                 }
//             ]
//         }
//     ]
// }
