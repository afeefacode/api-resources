<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\VarcharField;
use Afeefa\ApiResources\Relation\RelationBag;
use Afeefa\ApiResources\Relation\Relations\HasMany;
use Afeefa\ApiResources\Type\Type;

class TagType extends Type
{
    public static string $type = 'Example.Tag';

    protected function fields(FieldBag $fields): void
    {
        $fields->add('name', VarcharField::class);
    }

    protected function relations(RelationBag $relations): void
    {
        $relations->add('users', Type::class, HasMany::class);
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
