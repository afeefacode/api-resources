<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\HasOneRelation;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Resource\ResourceBag;
use Afeefa\ApiResources\Test\ApiBuilder;
use Afeefa\ApiResources\Test\ResourceBuilder;
use Afeefa\ApiResources\Test\TypeBuilder;
use Afeefa\ApiResources\Type\Type;
use Closure;
use PHPUnit\Framework\TestCase;

class SchemaTypeTest extends TestCase
{
    public function test_simple()
    {
        $type = $this->createType(
            'Test.Type',
            function (FieldBag $fields) {
                $fields
                    ->attribute('title', VarcharAttribute::class)
                    ->attribute('name', VarcharAttribute::class)
                    ->relation('related_type', get_class($this), HasOneRelation::class);
            }
        );

        $api = $this->createApi($type);

        $schema = $api->toSchemaJson();

        // debug_dump($schema);

        $expectedTypesSchema = [
            'Test.Type' => [
                'translations' => [],
                'fields' => [
                    'title' => [
                        'type' => 'Afeefa.VarcharAttribute'
                    ],
                    'name' => [
                        'type' => 'Afeefa.VarcharAttribute'
                    ],
                    'related_type' => [
                        'type' => 'Afeefa.HasOneRelation',
                        'related_type' => 'Test.Type'
                    ]
                ]
            ]
        ];

        $this->assertEquals($expectedTypesSchema, $schema['types']);

        $this->assertEquals([], $schema['validators']);
    }

    private function createType(string $type, ?Closure $fieldsCallback = null): Type
    {
        return (new TypeBuilder())
            ->type($type, $fieldsCallback)
            ->get();
    }

    private function createApi(Type $type): Api
    {
        $resource = (new ResourceBuilder())
            ->resource(
                'Test.Resource',
                function (ActionBag $actions) use ($type) {
                    $actions->add('test_action', function (Action $action) use ($type) {
                        $action->response(get_class($type));
                    });
                }
            )
            ->get();

        return (new ApiBuilder())
            ->api(
                'Test.Api',
                function (ResourceBag $resources) use ($resource) {
                    $resources->add(get_class($resource));
                }
            )
            ->get();
    }
}
