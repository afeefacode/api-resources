<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Api\TypeRegistry;

/**
 * @method Attribute name(string $name)
 * @method Attribute validate(Closure $callback)
 * @method Attribute validator(Validator $validator)
 * @method Attribute required(bool $required = true)
 * @method Attribute allowed()
 * @method Attribute resolve(string|callable|Closure $classOrCallback)
*/
class Attribute extends Field
{
    protected $default;

    /**
     * @var bool
     */
    protected $defaultValueSet = false;

    public function default($default): Attribute
    {
        $this->default = $default;
        $this->defaultValueSet = true;
        return $this;
    }

    public function hasDefaultValue(): bool
    {
        return $this->defaultValueSet;
    }

    public function getDefaultValue()
    {
        return $this->default;
    }

    public function getSchemaJson(TypeRegistry $typeRegistry): array
    {
        $json = parent::getSchemaJson($typeRegistry);

        if ($this->defaultValueSet) {
            $json['default'] = $this->default;
        }

        return $json;
    }
}
