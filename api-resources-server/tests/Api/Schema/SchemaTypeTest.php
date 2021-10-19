<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\HasOneRelation;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Test\ApiBuilder;
use Afeefa\ApiResources\Test\TestApi;
use Afeefa\ApiResources\Test\TestResource;
use Afeefa\ApiResources\Type\Type;
use PHPUnit\Framework\TestCase;

class TypeTest extends TestCase
{
    public function test_simple()
    {
        $type = new class() extends Type {
            public static string $type = 'Test.Type';

            protected function fields(FieldBag $fields): void
            {
                $fields->attribute('title', VarcharAttribute::class);
                $fields->attribute('name', VarcharAttribute::class);

                $fields->relation('related_type', get_class($this), HasOneRelation::class);
            }
        };

        $api = (new ApiBuilder())
            ->api('Test.Api', function (TestApi $api) use ($type) {
                $api->resource('Test.Resource', function (TestResource $resource) use ($type) {
                    $resource->action('test_action', function (Action $action) use ($type) {
                        $action->response(get_class($type));
                    });
                });
            })
            ->get();

        // debug_dump($api->toSchemaJson());

        $schema = $api->toSchemaJson();

        $this->assertIsArray($schema['types']['Test.Type']);

        $typeSchema = $schema['types']['Test.Type'];
        $fieldsSchema = $typeSchema['fields'];

        $this->assertEquals(['title', 'name', 'related_type'], array_keys($fieldsSchema));

        $this->assertEquals(VarcharAttribute::$type, $fieldsSchema['name']['type']);
        $this->assertEquals(VarcharAttribute::$type, $fieldsSchema['title']['type']);
        $this->assertEquals(HasOneRelation::$type, $fieldsSchema['related_type']['type']);
        $this->assertEquals('Test.Type', $fieldsSchema['related_type']['related_type']);

        $this->assertEquals([], $schema['validators']);
        $this->assertArrayNotHasKey('update_fields', $typeSchema);
        $this->assertArrayNotHasKey('created_fields', $typeSchema);
    }
}
