<?php

namespace Afeefa\ApiResources\Field;

/**
 * @method Attribute name(string $name)
 * @method Attribute validate(Closure $callback)
 * @method Attribute validator(Validator $validator)
 * @method Attribute required(bool $required = true)
 * @method Attribute allowed()
 * @method Attribute resolver(string|callable|Closure $classOrCallback)
*/
class Attribute extends Field
{
}
