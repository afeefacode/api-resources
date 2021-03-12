<?php

namespace Backend\Types;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\VarcharField;
use Afeefa\ApiResources\Relation\RelationBag;
use Afeefa\ApiResources\Type\Type;

class TagType extends Type
{
    public string $type = 'Example.Tag';

    public function fields(FieldBag $fields): void
    {
        $fields->add('name', VarcharField::class);
    }

    public function relations(RelationBag $relations): void
    {
        $relations->hasMany('users', Type::class);
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
