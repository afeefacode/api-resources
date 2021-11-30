<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Action\ActionResponse;
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
            $fields->relation('some_relation', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'name' => true,
            'some_relation' => [
                'name' => true
            ]
        ]);

        $this->assertEquals(['name', 'some_relation'], $requestedFields->getFieldNames());
        $this->assertEquals(['name', 'some_relation'], $requestedFields->getFieldNamesForType($type));
        $this->assertTrue($requestedFields->hasField('name'));
        $this->assertTrue($requestedFields->hasField('some_relation'));
        $this->assertFalse($requestedFields->hasField('nix'));
        $this->assertNull($requestedFields->getNestedField('nix'));
        $this->assertSame($type, $requestedFields->getType());
        $this->assertEquals(['name' => $type->getAttribute('name')], $requestedFields->getAttributes());
        $this->assertEquals(['some_relation' => $type->getRelation('some_relation')], $requestedFields->getRelations());
        $this->assertSame(['name' => true, 'some_relation' => ['name' => true]], $requestedFields->toSchemaJson());
    }

    public function test_normalizes()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->relation('some_relation', T('TEST'), HasOneRelation::class);
            $fields->relation('relation2', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'name' => true, // attribute
            'count_some_relation' => true, // count relation
            'some_relation' => [ // relation
                'name' => true
            ],
            'relation2' => true, // relation collapsed
            '@TEST' => [ // on type
                'name' => true,
                'count_some_relation' => true,
                'some_relation' => [
                    'name' => true
                ],
                'relation2' => true
            ]
        ]);

        $expectedFields = [
            'name' => true,
            'count_some_relation' => true,
            'some_relation' => [
                'name' => true
            ],
            'relation2' => [],
            '@TEST' => [
                'name' => true,
                'count_some_relation' => true,
                'some_relation' => [
                    'name' => true
                ],
                'relation2' => [],
            ]
        ];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());
    }

    public function test_normalizes_null()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->relation('some_relation', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'name' => null,
            'some_relation' => null,
            '@TEST' => [
                'name' => null,
                'some_relation' => null
            ]
        ]);

        $expectedFields = ['@TEST' => []];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());
    }

    public function test_normalizes_attributes()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->attribute('name2', VarcharAttribute::class);
            $fields->attribute('name3', VarcharAttribute::class);
            $fields->attribute('name4', VarcharAttribute::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'name' => true,
            'name2' => false,
            'name3' => [],
            'name4' => null
        ]);

        $expectedFields = [
            'name' => true
        ];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());
    }

    public function test_normalizes_relations()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->relation('some_relation', T('TEST'), HasOneRelation::class);
            $fields->relation('relation2', T('TEST'), HasOneRelation::class);
            $fields->relation('relation3', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'some_relation' => true,
            'relation2' => [],
            'relation3' => [
                'name' => true
            ]
        ]);

        $expectedFields = [
            'some_relation' => [],
            'relation2' => [],
            'relation3' => [
                'name' => true
            ]
        ];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());
    }

    public function test_normalizes_nested()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->relation('some_relation', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'some_relation' => [
                'name' => true,
                'some_relation' => [
                    'name' => true,
                    'some_relation' => [
                        'name' => true,
                        '@TEST' => [
                            'name' => true
                        ]
                    ]
                ]
            ]
        ]);

        $expectedFields = [
            'some_relation' => [
                'name' => true,
                'some_relation' => [
                    'name' => true,
                    'some_relation' => [
                        'name' => true,
                        '@TEST' => [
                            'name' => true
                        ]
                    ]
                ]
            ]
        ];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());
    }

    public function test_normalizes_not_existing_fields()
    {
        $type = $this->createType(); // no fields

        $requestedFields = $this->createRequestedFields($type, [
            'attribute_notexists' => true,
            'count_some_relation_notexists' => true,
            'relation_notexists' => [
                'attribute_notexists' => true,
                'relation_notexists' => true,
            ],
            '@TEST' => [ // on existing type
                'attribute_notexists' => true,
                'count_some_relation_notexists' => true,
                'relation_notexists' => true
            ],
            '@TEST_NOTEXISTS' => [
                'attribute_notexists' => true,
                'count_some_relation_notexists' => true,
                'relation_notexists' => true
            ]
        ]);

        $expectedFields = ['@TEST' => []];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());
    }

    public function test_get_nested()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->relation('some_relation', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'some_relation' => [
                'name' => true,
                'some_relation' => [
                    'name' => true
                ]
            ]
        ]);

        $nestedFields = $requestedFields->getNestedField('some_relation');

        $expectedFields = [
            'name' => true,
            'some_relation' => [
                'name' => true,
            ]
        ];

        $this->assertSame($expectedFields, $nestedFields->toSchemaJson());

        $nestedNestedFields = $nestedFields->getNestedField('some_relation');

        $expectedFields = [
            'name' => true
        ];

        $this->assertSame($expectedFields, $nestedNestedFields->toSchemaJson());
    }

    public function test_get_nested_wrong_fieldname()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->relation('some_relation', T('TEST'), HasOneRelation::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'some_relation' => [
                'name' => true,
                'some_relation' => [
                    'name' => true
                ]
            ]
        ]);

        $nestedFields = $requestedFields->getNestedField('this_is_wrong');

        $this->assertNull($nestedFields);
    }

    public function test_union_type()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
            $fields->relation('some_relation', T('TEST'), HasOneRelation::class);
        });

        $type2 = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name2', VarcharAttribute::class);
        }, 'TEST2');

        $requestedFields = $this->createRequestedFields([$type, $type2], [
            'name' => true,
            'some_relation' => [
                'name' => true
            ],
            '@TEST2' => [
                'name2' => true
            ]
        ]);

        $expectedFields = [
            'name' => true,
            'some_relation' => [
                'name' => true
            ],
            '@TEST2' => [
                'name2' => true
            ]
        ];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());

        $this->assertEquals(['name', 'some_relation', '@TEST2'], $requestedFields->getFieldNames());
        $this->assertEquals(['name', 'some_relation'], $requestedFields->getFieldNamesForType($type));
        $this->assertEquals(['name', 'some_relation', 'name2'], $requestedFields->getFieldNamesForType($type2));

        $this->assertTrue($requestedFields->hasField('name'));
        $this->assertTrue($requestedFields->hasField('some_relation'));
        $this->assertTrue($requestedFields->getNestedField('@TEST2')->hasField('name2'));
    }

    public function test_union_type_not_exists()
    {
        $type = $this->createType(function (FieldBag $fields) {
            $fields->attribute('name', VarcharAttribute::class);
        });

        $requestedFields = $this->createRequestedFields($type, [
            'name' => true,
            '@TEST2' => [
                'name2' => true
            ]
        ]);

        $expectedFields = ['name' => true];

        $this->assertSame($expectedFields, $requestedFields->toSchemaJson());

        $this->assertEquals(['name'], $requestedFields->getFieldNames());
        $this->assertEquals(['name'], $requestedFields->getFieldNamesForType($type));

        $this->assertTrue($requestedFields->hasField('name'));
        $this->assertNull($requestedFields->getNestedField('@TEST2'));
    }

    private function createType(?Closure $fieldsCallback = null, ?string $typeName = null): Type
    {
        $typeName ??= 'TEST';
        return $this->typeBuilder()->type($typeName, function (FieldBag $fields) use ($fieldsCallback) {
            if ($fieldsCallback) {
                $fieldsCallback($fields);
            }
        })->get(true);
    }

    private function createRequestedFields(Type | array $typeOrTypes, array $fields): RequestedFields
    {
        $response = $this->container->create(ActionResponse::class);
        if (is_array($typeOrTypes)) {
            $response->typeClasses(array_map(fn ($type) => $type::class, $typeOrTypes));
        } else {
            $response->typeClass($typeOrTypes::class);
        }

        return $this->container->create(RequestedFields::class)
            ->response($response)
            ->fields($fields);
    }
}
