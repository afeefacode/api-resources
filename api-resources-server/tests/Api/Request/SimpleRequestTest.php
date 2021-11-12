<?php

namespace Afeefa\ApiResources\Tests\Api\Schema;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\DB\ActionResolver;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Test\ApiResourcesTest;
use function Afeefa\ApiResources\Test\T;
use Closure;

class SimpleRequestTest extends ApiResourcesTest
{
    public function test_request()
    {
        $api = $this->apiBuilder()->api('API', function (Closure $addResource) {
            $addResource('RES', function (Closure $addAction) {
                $addAction('ACT', function (Action $action) {
                    $action
                        ->input(T('TYPE'))
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
                ->resourceType('RES')
                ->actionName('ACT');
        });

        $data = $result['data'];

        $this->assertEquals('TYPE', $data->type);
        $this->assertEquals('test', $data->name);

        // debug_dump($result['data']->jsonSerialize());
    }
}
