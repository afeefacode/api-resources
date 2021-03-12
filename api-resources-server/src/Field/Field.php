<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;
use Afeefa\ApiResources\Validator\Validator;

class Field implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    public string $type;

    public string $name;

    public ?Validator $validator = null;

    public bool $required = false;

    public bool $allowed = false;

    public function created(): void
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
            $Validator = $this->container->getCallbackArgumentType($callback);
            $this->container->add($Validator); // register validator class
            $this->validator = $this->container->create($Validator);
            $callback($this->validator);
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
        $field = $this->container->create(static::class);
        $field->name = $this->name;
        $field->required = $this->required;
        if ($this->validator) {
            $field->validator = $this->validator->clone();
        }
        return $field;
    }

    public function toSchemaJson(): array
    {
        $json = [
            'type' => $this->type,
            // 'name' => $this->name
        ];

        if ($this->required) {
            $json['required'] = true;
        }

        if ($this->validator) {
            $json['validator'] = $this->validator->toSchemaJson();
            unset($json['validator']['rules']);
        }

        return $json;
    }
}
