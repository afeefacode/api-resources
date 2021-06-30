<?php

namespace Afeefa\ApiResources\DB;

use Afeefa\ApiResources\Field\Attribute;
use Closure;

class AttributeResolver extends DataResolver
{
    protected Attribute $attribute;

    protected ?Closure $countCallback = null;

    public function attribute(Attribute $attribute): AttributeResolver
    {
        $this->attribute = $attribute;
        return $this;
    }

    public function getAttribute(): Attribute
    {
        return $this->attribute;
    }

    public function count(Closure $callback): AttributeResolver
    {
        $this->countCallback = $callback;
        return $this;
    }

    public function getCount()
    {
        if (isset($this->countCallback)) {
            return ($this->countCallback)();
        }
    }
}
