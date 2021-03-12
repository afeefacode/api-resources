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

    public bool $required = false;

    public bool $allowed = false;

    public function __construct()
    {
        if (!isset($this->type)) {
            throw new MissingTypeException('Missing type for field of class ' . static::class);
        };
    }

    public function validate(callable $callback): Field
    {
        if ($this->validator) {
            $callback($this->validator);
        } else {
            $f = new ReflectionFunction($callback);
            $param = $f->getParameters()[0] ?? null;
            if ($param) {
                /** @var ReflectionNamedType */
                $type = $param->getType();
                if ($type) {
                    $Validator = $type->getName();
                    $this->validator = new $Validator();
                    $callback($this->validator);
                }
            }
        }

        return $this;
    }

    public function required(): Field
    {
        $this->required = true;
        return $this;
    }

    public function allowed(): Field
    {
        $this->allowed = true;
        return $this;
    }

    public function clone(): Field
    {
        $field = new static();
        $field->name = $this->name;
        $field->required = $this->required;
        if ($this->validator) {
            $field->validator = $this->validator->clone();
        }
        return $field;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        // $visitor->field(new static());

        $json = [
            'type' => $this->type,
            // 'name' => $this->name
        ];

        if ($this->required) {
            $json['required'] = true;
        }

        if ($this->validator) {
            $json['validator'] = $this->validator->toSchemaJson($visitor);
            unset($json['validator']['rules']);
        }

        return $json;
    }
}
