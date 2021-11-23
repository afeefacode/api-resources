<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Field\Attribute;

/**
 * @property Attribute $field
 */
class BaseAttributeResolver extends BaseFieldResolver
{
    public function attribute(Attribute $attribute): BaseAttributeResolver
    {
        return parent::field($attribute);
    }

    public function getAttribute(): Attribute
    {
        return $this->field;
    }

    public function resolve()
    {
    }
}
