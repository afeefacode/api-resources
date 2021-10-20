<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Resource\ResourceBag;
use Afeefa\ApiResources\Test\ApiBuilder;
use Afeefa\ApiResources\Test\ResourceBuilder;
use Afeefa\ApiResources\Test\TypeBuilder;
use Afeefa\ApiResources\Type\Type;
use PHPUnit\Framework\TestCase;

class SchemaResourceTest extends TestCase
{
    public function test_simple()
    {
        $type = $this->createType('Test.Type');

        $api = $this->createApi($type);

        $schema = $api->toSchemaJson();

        // debug_dump($schema);

        $expectedResourcesSchema = [
            'Test.Resource' => [
                'test_action' => [
                    'response' => [
                        'type' => 'Test.Type'
                    ]
                ]
            ]
        ];

        $this->assertEquals($expectedResourcesSchema, $schema['resources']);
    }

    private function createType(string $type): Type
    {
        return (new TypeBuilder())
            ->type($type)
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
