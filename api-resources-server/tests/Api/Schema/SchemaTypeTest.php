<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\HasOneRelation;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Tests\Fixtures\SingleTypeApi\SingleTypeApi;
use Afeefa\ApiResources\Type\Type;
use PHPUnit\Framework\TestCase;

class SchemaTypeTest extends TestCase
{
    public function test_simple()
    {
        $type = new class() extends Type {
            public static string $type = 'Test.SchemaType';

            protected function fields(FieldBag $fields): void
            {
                $fields->attribute('title', VarcharAttribute::class);
                $fields->attribute('name', VarcharAttribute::class);

                $fields->relation('related_type', get_class($this), HasOneRelation::class);
            }
        };

        $api = SingleTypeApi::create(get_class($type));

        debug_dump($api->toSchemaJson());

        $schema = $api->toSchemaJson();

        $this->assertIsArray($schema['types']['Test.SchemaType']);

        $typeSchema = $schema['types']['Test.SchemaType'];
        $fieldsSchema = $typeSchema['fields'];

        $this->assertEquals(['title', 'name', 'related_type'], array_keys($fieldsSchema));

        $this->assertEquals(VarcharAttribute::$type, $fieldsSchema['name']['type']);
        $this->assertEquals(VarcharAttribute::$type, $fieldsSchema['title']['type']);
        $this->assertEquals(HasOneRelation::$type, $fieldsSchema['related_type']['type']);
        $this->assertEquals('Test.SchemaType', $fieldsSchema['related_type']['related_type']);

        $this->assertEquals([], $schema['validators']);
        $this->assertArrayNotHasKey('update_fields', $typeSchema);
        $this->assertArrayNotHasKey('created_fields', $typeSchema);
    }
}
