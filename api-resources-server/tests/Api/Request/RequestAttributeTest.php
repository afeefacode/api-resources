<?php

namespace Afeefa\ApiResources\Tests\Api\Schema;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\DB\ActionResolver;
use Afeefa\ApiResources\DB\AttributeResolver;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Test\ApiResourcesTest;
use function Afeefa\ApiResources\Test\T;

use Closure;

class RequestAttributeTest extends ApiResourcesTest
{
    public function test_request_with_attribute()
    {
        $api = $this->apiBuilder()->api('API', function (Closure $addResource, Closure $addType) {
            $addType('TYPE', function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)

                    ->attribute('dependent', function (VarcharAttribute $attribute) {
                        $attribute->depends('name');
                    })

                    ->attribute('resolved', function (VarcharAttribute $attribute) {
                        $attribute->resolve(function (AttributeResolver $r) {
                            $r->load(function (array $owners) {
                                /** @var ModelInterface[] $owners */
                                foreach ($owners as $owner) {
                                    $owner->apiResourcesSetAttribute('dependent', 'test_dependency');
                                }
                                return [];
                            });
                        });
                    });
            });

            $addResource('RES', function (Closure $addAction) {
                $addAction('ACT', function (Action $action) {
                    $action
                        ->response(T('TYPE'))
                        ->resolve(function (ActionResolver $resolver) {
                            $resolver->load(function () {
                                return Model::fromSingle('TYPE', [
                                    'name' => 'test'
                                ]);
                            });
                        });
                });
            });
        })->get();

        $result = $api->request(function (ApiRequest $request) {
            $request
                ->fromInput([
                    'resource' => 'RES',
                    'action' => 'ACT',
                    'fields' => [
                        'name' => true,
                        'dependent' => true,
                        'resolved' => true
                    ]
                ]);
        });

        $data = ($result['data'])->jsonSerialize();

        $expectedData = [
            'type' => 'TYPE',
            'name' => 'test',
            'dependent' => 'test_dependency'
        ];

        $this->assertEquals($expectedData, $data);
    }
}

// attribute
// attribute not defined
// id type are always sent
// attribute with depedencies
// attribute with custom resolver
