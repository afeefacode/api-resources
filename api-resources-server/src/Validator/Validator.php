<?php

namespace Afeefa\ApiResources\Validator;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Utils\HasStaticTypeTrait;
use Afeefa\ApiResources\Validator\Rule\RuleBag;
use ArrayObject;

class Validator implements ToSchemaJsonInterface
{
    use HasStaticTypeTrait;

    public array $params = [];

    protected RuleBag $rules;

    public function __construct()
    {
        $this->rules = new RuleBag();
        $this->rules($this->rules);
    }

    public function clone(): Validator
    {
        $validator = new static();

        $arrObject = new ArrayObject($this->params);
        $validator->params = $arrObject->getArrayCopy();
        return $validator;
    }

    protected function param($name, $value): Validator
    {
        $this->params[$name] = $value;
        return $this;
    }

    protected function rules(RuleBag $rules): void
    {
    }

    public function toSchemaJson(): array
    {
        return [
            'type' => $this::type(),
            'params' => $this->params,
            'rules' => $this->rules->toSchemaJson(),
        ];
    }
}
