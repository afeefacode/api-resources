<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Api\RequestedFields;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\HasOneRelation;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Test\ApiResourcesTest;
use function Afeefa\ApiResources\Test\T;
use Afeefa\ApiResources\Type\Type;

use Closure;

class RequestedFieldsTest extends ApiResourcesTest
{
    public function test_simple()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->relation('test_relation', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'name' => true,
            'test_relation' => [
                'name' => true
            ]
        ]);

        $this->assertEquals(['name', 'test_relation'], $requestedFields->getFieldNames());
        $this->assertEquals(['name', 'test_relation'], $requestedFields->getFieldNamesForType($type));
        $this->assertTrue($requestedFields->hasField('name'));
        $this->assertTrue($requestedFields->hasField('test_relation'));
        $this->assertFalse($requestedFields->hasField('nix'));
        $this->assertNull($requestedFields->getNestedField('nix'));
        $this->assertSame($type, $requestedFields->getType());
        $this->assertEquals(['name' => $type->getAttribute('name')], $requestedFields->getAttributes());
        $this->assertEquals(['test_relation' => $type->getRelation('test_relation')], $requestedFields->getRelations());
        $this->assertSame(['name' => true, 'test_relation' => ['name' => true]], $requestedFields->toSchemaJson());
    }

    public function test_normalizes()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->relation('test_relation', T('TEST'), HasOneRelation::class);
            $fields->relation('test_relation2', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'name' => true, // attribute
            'count_test_relation' => true, // count relation
            'test_relation' => [ // relation
                'name' => true
            ],
            'test_relation2' => true, // relation collapsed
            '@TEST' => [ // on type
                'name' => true,
                'count_test_relation' => true,
                'test_relation' => [
                    'name' => true
                ],
                'test_relation2' => true
            ]
        ]);

        $expectedFields = [
            'name' => true,
            'count_test_relation' => true,
            'test_relation' => [
                'name' => true
            ],
            'test_relation2' => [],
            '@TEST' => [
                'name' => true,
                'count_test_relation' => true,
                'test_relation' => [
                    'name' => true
                ],
                'test_relation2' => [],
            ]
        ];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());
    }

    public function test_normalizes_duplicated_fields()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->attribute('name2', VarcharAttribute::class);
            $fields->relation('test_relation', T('TEST'), HasOneRelation::class);
            $fields->relation('test_relation2', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'test_relation' => [
                'name' => true
            ],
            'test_relation' => [
                'name2' => true
            ]
        ]);

        $expectedFields = [
            'test_relation' => [
                'name2' => true
            ]
        ];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());
    }

    public function test_normalizes_null()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->relation('test_relation', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'name' => null,
            'test_relation' => null,
            '@TEST' => [
                'name' => null,
                'test_relation' => null
            ]
        ]);

        $expectedFields = ['@TEST' => []];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());
    }

    public function test_normalizes_not_existing_fields()
    {
        $type = $this->createType(); // no fields

        $requestedFields = $this->createRequestedFields($type, [
            'attribute_notexists' => true,
            'count_relation_notexists' => true,
            'relation_notexists' => [
                'attribute_notexists' => true,
                'relation_notexists' => true,
            ],
            '@TEST' => [ // on existing type
                'attribute_notexists' => true,
                'count_relation_notexists' => true,
                'relation_notexists' => true
            ],
            '@TEST_NOTEXISTS' => [
                'attribute_notexists' => true,
                'count_relation_notexists' => true,
                'relation_notexists' => true
            ]
        ]);

        $expectedFields = ['@TEST' => []];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());
    }

    private function createType(?Closure $fieldsCallback = null): Type
    {
        return $this->typeBuilder()->type('TEST', function (FieldBag $fields) use ($fieldsCallback) {
            if ($fieldsCallback) {
                $fieldsCallback($fields);
            }
        })->get(true);
    }

    private function createRequestedFields(Type $type, array $fields): RequestedFields
    {
        return $this->container->create(RequestedFields::class)
            ->typeClass($type::class)
            ->fields($fields);
    }
}
