<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;
use Afeefa\ApiResources\Validator\Validator;
use ReflectionFunction;
use ReflectionNamedType;

class Field implements ToSchemaJsonInterface
{
    public string $type;

    public string $name;

    public ?Validator $validator = null;

    public function __construct()
    {
        if (!isset($this->type)) {
            throw new MissingTypeException('Missing type for field of class ' . static::class);
        };
    }

    public function validate(callable $callback): Field
    {
        $f = new ReflectionFunction($callback);
        $param = $f->getParameters()[0] ?? null;
        if ($param) {
            /** @var ReflectionNamedType */
            $type = $param->getType();
            if ($type) {
                $Validator = $type->getName();
                $validator = new $Validator();
                $callback($validator);
                $this->validator = $validator;
            }
        }

        return $this;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $visitor->field(new static());

        $json = [
            'type' => $this->type
        ];

        if ($this->validator) {
            $Validator = get_class($this->validator);
            $visitor->validator(new $Validator());

            $json['validator'] = $this->validator->toSchemaJson($visitor);
        }

        return $json;
    }
}
