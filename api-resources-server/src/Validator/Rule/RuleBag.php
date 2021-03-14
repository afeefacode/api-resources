<?php

namespace Afeefa\ApiResources\Validator\Rule;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;

class RuleBag implements ToSchemaJsonInterface
{
    /**
     * @var Rule[]
     */
    public array $rules = [];

    public function add(string $name): Rule
    {
        $rule = new Rule();
        $this->rules[$name] = $rule;
        return $rule;
    }

    public function toSchemaJson(): array
    {
        return array_map(function (Rule $rule) {
            return $rule->toSchemaJson();
        }, $this->rules);
    }
}
