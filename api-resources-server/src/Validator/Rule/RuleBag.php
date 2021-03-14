<?php

namespace Afeefa\ApiResources\Validator\Rule;

use Afeefa\ApiResources\Bag\Bag;

/**
 * @property Rule[] $entries
 */
class RuleBag extends Bag
{
    public function add(string $name): Rule
    {
        $rule = new Rule();
        $this->entries[$name] = $rule;
        return $rule;
    }
}
