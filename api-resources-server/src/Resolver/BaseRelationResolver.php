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

    public function getResolveParams(): array
    {
        return $this->field->getResolveParams();
    }

    public function getResolveParam(string $name)
    {
        return $this->field->getResolveParam($name);
    }
}
