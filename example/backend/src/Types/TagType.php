<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\HasManyRelation;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Type\Type;

class TagType extends Type
{
    public static string $type = 'Example.TagType';

    protected function fields(FieldBag $fields): void
    {
        $fields->attribute('name', VarcharAttribute::class);

        $fields->relation('users', Type::class, HasManyRelation::class);
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
