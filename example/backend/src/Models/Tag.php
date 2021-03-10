<?php

namespace Backend\Models;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Relation\RelationBag;

class Tag extends Model
{
    public string $type = 'Example.Tag';

    public function fields(FieldBag $fields): void
    {
        $fields->varchar('name');
    }

    public function relations(RelationBag $relations): void
    {
        $relations->hasMany('users', Model::class);
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
