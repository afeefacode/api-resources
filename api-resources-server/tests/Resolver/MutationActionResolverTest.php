<?php

namespace Afeefa\ApiResources\Tests\Resolver;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Resolver\MutationActionResolver;
use Afeefa\ApiResources\Test\ApiResourcesTest;
use function Afeefa\ApiResources\Test\T;

use Closure;
use stdClass;

class MutationActionResolverTest extends ApiResourcesTest
{
    private TestWatcher $testWatcher;

    protected function setUp(): void
    {
        parent::setup();

        $this->testWatcher = new TestWatcher();
    }

    /**
     * @dataProvider saveFieldsDataProvider
     */
    public function test_save_fields($fields, $expectedFields)
    {
        $api = $this->createApiWithTypeAndAction(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)
                    ->attribute('title', VarcharAttribute::class);
            },
            function (Action $action) {
                $action
                    ->response(T('TYPE'))
                    ->resolve(function (MutationActionResolver $r) {
                        $r->save(function () use ($r) {
                            $this->testWatcher->saveFields($r->getSaveFields());

                            return TestModel::fromSingle('TYPE', []);
                        });
                    });
            }
        );

        $this->request(
            $api,
            data: $fields
        );

        $this->assertEquals([$expectedFields], $this->testWatcher->saveFields);
    }

    public function saveFieldsDataProvider()
    {
        // [data fields, save fields]
        return [
            'name' => [
                ['name' => 'name1'],
                ['name' => 'name1']
            ],

            'title' => [
                ['title' => 'title1'],
                ['title' => 'title1']
            ],

            'name+title' => [
                [
                    'name' => 'name1',
                    'title' => 'title1'
                ],
                [
                    'name' => 'name1',
                    'title' => 'title1'
                ]
            ],

            'name+title+unknown' => [
                [
                    'name' => 'name1',
                    'title' => 'title1',
                    'unknown' => 'unknown'
                ],
                [
                    'name' => 'name1',
                    'title' => 'title1'
                ]
            ],

            'nothing' => [
                null,
                []
            ],

            'empty' => [[], []],

            'unknown_relation' => [
                ['relation' => ['field' => true]],
                []
            ]
        ];
    }

    /**
     * @dataProvider wrongSaveReturnDataProvider
     */
    public function test_does_not_return_model($return)
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Save callback of mutation resolver for action ACT on resource RES must return a ModelInterface object.');

        $api = $this->createApiWithAction(
            function (Action $action) use ($return) {
                $action
                    ->response(T('TYPE'))
                    ->resolve(function (MutationActionResolver $r) use ($return) {
                        $r->save(function () use ($return) {
                            if ($return !== 'NOTHING') {
                                return $return;
                            }
                        });
                    });
            }
        );

        $this->request($api);
    }

    public function wrongSaveReturnDataProvider()
    {
        return [
            'null' => [null],
            'array' => [[]],
            'string' => ['string'],
            'object' => [new stdClass()],
            'nothing' => ['NOTHING']
        ];
    }

    private function createApiWithTypeAndAction(Closure $fieldsCallback, Closure $actionCallback): Api
    {
        return $this->apiBuilder()->api('API', function (Closure $addResource, Closure $addType) use ($fieldsCallback, $actionCallback) {
            $addType('TYPE', $fieldsCallback);
            $addResource('RES', function (Closure $addAction) use ($actionCallback) {
                $addAction('ACT', $actionCallback);
            });
        })->get();
    }

    private function createApiWithAction(Closure $actionCallback): Api
    {
        return $this->apiBuilder()->api('API', function (Closure $addResource) use ($actionCallback) {
            $addResource('RES', function (Closure $addAction) use ($actionCallback) {
                $addAction('ACT', $actionCallback);
            });
        })->get();
    }

    private function request(Api $api, ?array $data = null): array
    {
        return $api->request(function (ApiRequest $request) use ($data) {
            $request
                ->resourceType('RES')
                ->actionName('ACT');

            if ($data !== null) {
                $request->fieldsToSave($data);
            }
        });
    }
}
