<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use function Afeefa\ApiResources\Test\createApiWithSingleResource;

use function Afeefa\ApiResources\Test\T;

use PHPUnit\Framework\TestCase;

class SchemaActionTest extends TestCase
{
    public function test_simple()
    {
        $api = createApiWithSingleResource(function (ActionBag $actions) {
            $actions
                ->add('test_action', function (Action $action) {
                    $action->response(T('Test.Type'));
                });
        });

        $schema = $api->toSchemaJson();

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
}
