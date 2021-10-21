<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Field\FieldBag;

use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use function Afeefa\ApiResources\Test\createApiWithSingleType;

use Afeefa\ApiResources\Test\TypeRegistry;
use Afeefa\ApiResources\Test\ValidatorBuilder;
use Afeefa\ApiResources\Validator\Rule\RuleBag;
use PHPUnit\Framework\TestCase;

class SchemaValidatorTest extends TestCase
{
    protected function setUp(): void
    {
        TypeRegistry::reset();
    }

    public function test_simple()
    {
        $validator = (new ValidatorBuilder())
            ->validator(
                'Test.Validator',
                function (RuleBag $rules) {
                    $rules
                        ->add('min')
                        ->message('{{ fieldLabel }} should be greater than {{ param }}.');
                }
            )
            ->get();

        $api = createApiWithSingleType(
            'Test.Type',
            function (FieldBag $fields) use ($validator) {
                $fields
                    ->attribute('title', function (VarcharAttribute $attribute) use ($validator) {
                        $attribute->validate($validator->min(4));
                    });
            }
        );

        $schema = $api->toSchemaJson();

        // debug_dump($schema);

        $expectedTypesSchema = [
            'Test.Type' => [
                'translations' => [],
                'fields' => [
                    'title' => [
                        'type' => 'Afeefa.VarcharAttribute',
                        'validator' => [
                            'type' => 'Test.Validator',
                            'params' => [
                                'min' => 4
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $this->assertEquals($expectedTypesSchema, $schema['types']);

        $expectedValidatorsSchema = [
            'Test.Validator' => [
                'rules' => [
                    'min' => [
                        'message' => '{{ fieldLabel }} should be greater than {{ param }}.'
                    ]
                ]
            ]
        ];

        $this->assertEquals($expectedValidatorsSchema, $schema['validators']);
    }
}
