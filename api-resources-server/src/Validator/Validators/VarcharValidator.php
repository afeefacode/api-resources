<?php

namespace Afeefa\ApiResources\Validator\Validators;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Validator\Validator;

class VarcharValidator extends Validator
{
    public string $type = 'Afeefa.Varchar';

    public int $min;
    public int $max;
    public bool $empty = true;
    public $emptyValue;

    public function min(int $min): VarcharValidator
    {
        $this->min = $min;
        return $this;
    }

    public function max(int $max): VarcharValidator
    {
        $this->max = $max;
        return $this;
    }

    public function empty(bool $empty, $emptyValue = ''): VarcharValidator
    {
        $this->empty = $empty;
        $this->emptyValue = $emptyValue;
        return $this;
    }

    // wait for php8 return type static
    public function required(): VarcharValidator
    {
        return $this;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $json = parent::toSchemaJson($visitor);

        if (isset($this->min)) {
            $json['min'] = $this->min;
        }

        return $json;
    }
}
