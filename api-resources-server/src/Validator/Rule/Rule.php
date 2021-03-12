<?php

namespace Afeefa\ApiResources\Validator\Rule;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;

class Rule implements ToSchemaJsonInterface
{
    public string $message = '{{ fieldName }} ist ungültig.';

    public $validate;

    public function message($message)
    {
        $this->message = $message;
        return $this;
    }

    public function validate($validate): Rule
    {
        $this->validate = $validate;
        return $this;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $json = [
            'message' => $this->message
        ];

        return $json;
    }
}
