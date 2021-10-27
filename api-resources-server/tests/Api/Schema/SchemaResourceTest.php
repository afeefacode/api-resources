<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeException;
use Afeefa\ApiResources\Resource\ResourceBag;
use Afeefa\ApiResources\Test\ApiBuilder;
use Afeefa\ApiResources\Test\ResourceBuilder;
use function Afeefa\ApiResources\Test\T;
use Closure;

use PHPUnit\Framework\TestCase;

class SchemaResourceTest extends TestCase
{
    public function test_simple()
    {
        $api = $this->createApiWithSingleResource(
            'Test.Resource',
            function (ActionBag $actions) {
                $actions
                    ->add('test_action', function (Action $action) {
                        $action->response(T('Test.Type'));
                    })
                    ->add('test_action2', function (Action $action) {
                        $action->response(T('Test.Type2'));
                    });
            }
        );

        $schema = $api->toSchemaJson();

        $expectedResourcesSchema = [
            'Test.Resource' => [
                'test_action' => [
                    'response' => [
                        'type' => 'Test.Type'
                    ]
                ],
                'test_action2' => [
                    'response' => [
                        'type' => 'Test.Type2'
                    ]
                ]
            ]
        ];

        $this->assertEquals($expectedResourcesSchema, $schema['resources']);
    }

    public function test_get_type_with_missing_type()
    {
        $this->expectException(MissingTypeException::class);
        $this->expectExceptionMessageMatches('/^Missing type for class Afeefa\\\ApiResources\\\Test\\\TestResource@anonymous/');

        $resource = (new ResourceBuilder())->resource()->get();

        $resource->type();
    }

    public function test_add_with_missing_type()
    {
        $this->expectException(MissingTypeException::class);
        $this->expectExceptionMessageMatches('/^Missing type for class Afeefa\\\ApiResources\\\Test\\\TestResource@anonymous/');

        $resource = (new ResourceBuilder())->resource()->get();

        $this->createApiWithResourceClass($resource::class);
    }

    private function createApiWithSingleResource(string $type, Closure $actionsCallback): Api
    {
        $resource = (new ResourceBuilder())
            ->resource($type, $actionsCallback)
            ->get();

        return (new ApiBuilder())
            ->api(
                'Test.Api',
                function (ResourceBag $resources) use ($resource) {
                    $resources->add($resource::class);
                }
            )
            ->get();
    }

    private function createApiWithResourceClass(string $resourceClass): Api
    {
        return (new ApiBuilder())
            ->api(
                'Test.Api',
                function (ResourceBag $resources) use ($resourceClass) {
                    $resources->add($resourceClass);
                }
            )
            ->get();
    }
}
