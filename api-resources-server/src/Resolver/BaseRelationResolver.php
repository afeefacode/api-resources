<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Field\Relation;

/**
 * @property Relation $field
 */
class BaseRelationResolver extends BaseFieldResolver
{
    public function relation(Relation $relation): BaseRelationResolver
    {
        return parent::field($relation);
    }

    public function getRelation(): Relation
    {
        return $this->field;
    }
}
