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
use function Afeefa\ApiResources\Test\T;
use Afeefa\ApiResources\Test\TypeBuilder;
use Afeefa\ApiResources\Test\TypeRegistry;
use Closure;

use PHPUnit\Framework\TestCase;

class SchemaTypeTest extends TestCase
{
    protected function setUp(): void
    {
        TypeRegistry::reset();
    }

    public function test_simple()
    {
        $api = $this->createApiWithType(
            'Test.Type',
            function (FieldBag $fields) {
                $fields
                    ->attribute('title', VarcharAttribute::class)
                    ->attribute('name', VarcharAttribute::class)
                    ->relation('related_type', $this::class, HasOneRelation::class);
            }
        );

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

    private function createApiWithType(string $typeName, ?Closure $fieldsCallback = null): Api
    {
        (new TypeBuilder())->type($typeName, $fieldsCallback);

        $resource = (new ResourceBuilder())
            ->resource(
                'Test.Resource',
                function (ActionBag $actions) use ($typeName) {
                    $actions->add('test_action', function (Action $action) use ($typeName) {
                        $action->response(T($typeName));
                    });
                }
            )
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
}
