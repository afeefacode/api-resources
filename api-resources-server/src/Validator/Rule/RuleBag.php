<?php

namespace Afeefa\ApiResources\Validator\Rule;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;

class RuleBag implements ToSchemaJsonInterface
{
    /**
     * @var array<Rule>
     */
    public array $rules = [];

    public function add(string $name): Rule
    {
        $rule = new Rule();
        $this->rules[$name] = $rule;
        return $rule;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        return array_map(function (Rule $rule) use ($visitor) {
            return $rule->toSchemaJson($visitor);
        }, $this->rules);
    }
}
