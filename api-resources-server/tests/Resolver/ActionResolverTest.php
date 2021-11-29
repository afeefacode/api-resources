<?php

namespace Afeefa\ApiResources\Tests\Resolver;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackException;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Resolver\QueryActionResolver;
use Afeefa\ApiResources\Test\ApiResourcesTest;
use function Afeefa\ApiResources\Test\T;

use Afeefa\ApiResources\Type\Type;

use Closure;
use stdClass;

class ActionResolverTest extends ApiResourcesTest
{
    private TestWatcher $testWatcher;

    protected function setUp(): void
    {
        parent::setup();

        $this->testWatcher = new TestWatcher();
    }

    public function test_called_once()
    {
        $api = $this->createApiWithAction(function (Action $action) {
            $action
                ->response(T('TYPE'))
                ->resolve(function (QueryActionResolver $r) {
                    $this->testWatcher->called();

                    $r->load(function () {
                        return Model::fromSingle('TYPE', []);
                    });
                });
        });

        $this->assertEquals(0, $this->testWatcher->countCalls);

        $this->request($api);

        $this->assertEquals(1, $this->testWatcher->countCalls);
    }

    public function test_missing_action_resolver()
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Resolve callback for action ACT on resource RES must receive an ActionResolver as argument.');

        $api = $this->createApiWithAction(function (Action $action) {
            $action
                ->response(T('TYPE'))
                ->resolve(function () {
                });
        });

        $this->request($api);
    }

    public function test_missing_load_callback()
    {
        $this->expectException(MissingCallbackException::class);
        $this->expectExceptionMessage('Action resolver for action ACT on resource RES must provide a load callback.');

        $api = $this->createApiWithAction(function (Action $action) {
            $action
                ->response(T('TYPE'))
                ->resolve(function (QueryActionResolver $r) {
                });
        });

        $this->request($api);
    }

    /**
     * @dataProvider nullDataProvider
     */
    public function test_returns_null($null)
    {
        $api = $this->createApiWithAction(function (Action $action) use ($null) {
            $action
                ->response(T('TYPE'))
                ->resolve(function (QueryActionResolver $r) use ($null) {
                    $r->load(function () use ($null) {
                        if ($null) {
                            return null;
                        }
                    });
                });
        });

        $result = $this->request($api);

        $this->assertNull($result['data']);
    }

    public function nullDataProvider()
    {
        return [
            ['return null' => true],
            ['return nothing' => false]
        ];
    }

    public function test_returns_model()
    {
        $api = $this->createApiWithAction(function (Action $action) {
            $action
                ->response(T('TYPE'))
                ->resolve(function (QueryActionResolver $r) {
                    $r->load(function () {
                        return TestModel::fromSingle('TYPE', []);
                    });
                });
        });

        $result = $this->request($api);

        /** @var TestModel */
        $model = $result['data'];

        $this->assertInstanceOf(TestModel::class, $model);
        $this->assertEquals('TYPE', $model->type);
        $this->assertFalse(isset($model->id));
        $this->assertEquals(['id', 'type'], $model->getVisibleFields());
        $this->assertEquals([
            'type' => 'TYPE'
        ], $model->jsonSerialize());
    }

    public function test_returns_list_of_models()
    {
        $api = $this->createApiWithAction(function (Action $action) {
            $action
                ->response(Type::list(T('TYPE')))
                ->resolve(function (QueryActionResolver $r) {
                    $r->load(function () {
                        return TestModel::fromList('TYPE', [[], []]);
                    });
                });
        });

        $result = $this->request($api);

        /** @var TestModel[] */
        $models = $result['data'];

        $this->assertIsArray($models);
        $this->assertCount(2, $models);

        foreach ($models as $model) {
            $this->assertInstanceOf(TestModel::class, $model);
            $this->assertEquals('TYPE', $model->type);
            $this->assertFalse(isset($model->id));
            $this->assertEquals(['id', 'type'], $model->getVisibleFields());
            $this->assertEquals([
                'type' => 'TYPE'
            ], $model->jsonSerialize());
        }
    }

    public function test_returns_empty_list()
    {
        $api = $this->createApiWithAction(function (Action $action) {
            $action
                ->response(Type::list(T('TYPE')))
                ->resolve(function (QueryActionResolver $r) {
                    $r->load(function () {
                        return Model::fromList('TYPE', []);
                    });
                });
        });

        $result = $this->request($api);

        $models = $result['data'];
        $this->assertIsArray($models);
        $this->assertCount(0, $models);
    }

    /**
     * @dataProvider wrongModelDataProvider
     */
    public function test_returns_no_model($wrongModel)
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Load callback of action resolver for action ACT on resource RES must return a ModelInterface object or null.');

        $api = $this->createApiWithAction(function (Action $action) use ($wrongModel) {
            $action
                ->response(T('TYPE'))
                ->resolve(function (QueryActionResolver $r) use ($wrongModel) {
                    $r->load(function () use ($wrongModel) {
                        return $wrongModel;
                    });
                });
        });

        $this->request($api);
    }

    public function wrongModelDataProvider()
    {
        return [
            ['array' => []],
            ['string' => 'string'],
            ['object' => new stdClass()]
        ];
    }

    public function test_returns_no_list()
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Load callback of action resolver for action ACT on resource RES must return an array of ModelInterface objects.');

        $api = $this->createApiWithAction(function (Action $action) {
            $action
                ->response(Type::list(T('TYPE')))
                ->resolve(function (QueryActionResolver $r) {
                    $r->load(function () {
                        return new stdClass();
                    });
                });
        });

        $this->request($api);
    }

    public function test_returns_no_list_but_null()
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Load callback of action resolver for action ACT on resource RES must return an array of ModelInterface objects.');

        $api = $this->createApiWithAction(function (Action $action) {
            $action
                ->response(Type::list(T('TYPE')))
                ->resolve(function (QueryActionResolver $r) {
                    $r->load(function () {
                        return null;
                    });
                });
        });

        $this->request($api);
    }

    /**
     * @dataProvider wrongModelsDataProvider
     */
    public function test_returns_list_with_wrong_model($wrongModel)
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Load callback of action resolver for action ACT on resource RES must return an array of ModelInterface objects.');

        $api = $this->createApiWithAction(function (Action $action) use ($wrongModel) {
            $action
                ->response(Type::list(T('TYPE')))
                ->resolve(function (QueryActionResolver $r) use ($wrongModel) {
                    $r->load(function () use ($wrongModel) {
                        return [
                            Model::fromSingle('TEST', []),
                            $wrongModel
                        ];
                    });
                });
        });

        $this->request($api);
    }

    public function wrongModelsDataProvider()
    {
        return [
            ['null' => null],
            ['array' => []],
            ['string' => 'string'],
            ['object' => new stdClass()]
        ];
    }

    /**
     * @dataProvider requestFieldsDataProvider
     */
    public function test_requested_fields($fields, $expectedFields)
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
                    ->resolve(function (QueryActionResolver $r) {
                        $r->load(function () use ($r) {
                            $this->testWatcher->requestedFields($r->getRequest()->getFields()->getFieldNames());
                        });
                    });
            }
        );

        $this->request($api, $fields);

        $this->assertEquals([$expectedFields], $this->testWatcher->requestedFields);
    }

    /**
     * @dataProvider requestFieldsDataProvider
     */
    public function test_select_fields($fields, $expectedFields)
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
                    ->resolve(function (QueryActionResolver $r) {
                        $r->load(function () use ($r) {
                            $this->testWatcher->selectFields($r->getSelectFields());
                        });
                    });
            }
        );

        $this->request($api, $fields);

        $expectedFieldsWithId = ['id', ...$expectedFields];

        $this->assertEquals([$expectedFieldsWithId], $this->testWatcher->selectFields);
    }

    /**
     * @dataProvider requestFieldsDataProvider
     */
    public function test_visible_fields($fields, $expectedFields)
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
                    ->resolve(function (QueryActionResolver $r) {
                        $r->load(function () use ($r) {
                            return TestModel::fromSingle('TYPE', []);
                        });
                    });
            }
        );

        $result = $this->request($api, $fields);

        /** @var TestModel */
        $model = $result['data'];

        $expectedVisibleFields = ['id', 'type', ...$expectedFields];

        $this->assertEquals($expectedVisibleFields, $model->getVisibleFields());
    }

    public function requestFieldsDataProvider()
    {
        // [request fields, calculated fields]
        return [
            ['name' => ['name' => true], ['name']],

            ['title' => ['title' => true], ['title']],

            ['name+title' => [
                'name' => true,
                'title' => true
            ], ['name', 'title']],

            ['name+title+unknown' => [
                'name' => true,
                'title' => true,
                'unknown' => true
            ], ['name', 'title']],

            ['nothing' => null, []],

            ['empty' => [], []],

            ['unknown_relation' => [
                'relation' => [
                    'field' => true
                ]
            ], []]
        ];
    }

    public function test_request()
    {
        $api = $this->createApiWithAction(function (Action $action) {
            $action
                ->response(T('TYPE'))
                ->resolve(function (QueryActionResolver $r) {
                    $r->load(function () use ($r) {
                        $this->testWatcher->request($r->getRequest());
                    });
                });
        });

        $this->request(
            $api,
            params: [
                'a' => 1,
                'b' => true,
                'c' => 'value'
            ],
            filters: [
                'a' => 1,
                'b' => true,
                'c' => 'value'
            ]
        );

        $request = $this->testWatcher->request;

        $expectedParams = [
            'a' => 1,
            'b' => true,
            'c' => 'value'
        ];

        $this->assertEquals($expectedParams, $request->getParams());

        $this->assertTrue($request->hasParam('a'));
        $this->assertTrue($request->hasParam('b'));
        $this->assertTrue($request->hasParam('c'));
        $this->assertFalse($request->hasParam('d'));

        $expectedFilters = [
            'a' => 1,
            'b' => true,
            'c' => 'value'
        ];

        $this->assertEquals($expectedFilters, $request->getFilters());
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

    private function request(Api $api, ?array $fields = null, ?array $params = null, ?array $filters = null): array
    {
        return $api->request(function (ApiRequest $request) use ($fields, $params, $filters) {
            $request
                ->resourceType('RES')
                ->actionName('ACT');

            if ($fields) {
                $request->fields($fields);
            }

            if ($params) {
                $request->params($params);
            }

            if ($filters) {
                $request->filters($filters);
            }
        });
    }
}

/**
 * @method static TestModel fromSingle
 */
class TestModel extends Model
{
    public array $selectFields = [];

    public function selectFields(array $selectFields): TestModel
    {
        $this->selectFields = $selectFields;
        return $this;
    }

    public function getVisibleFields(): array
    {
        return $this->visibleFields;
    }
}

class TestWatcher
{
    public int $countCalls = 0;
    public array $selectFields = [];
    public array $requestedFields = [];
    public array $info = [];
    public ApiRequest $request;

    public function called()
    {
        $this->countCalls++;
    }

    public function info($info)
    {
        $this->info[] = $info;
    }

    public function selectFields(array $selectFields)
    {
        $this->selectFields[] = $selectFields;
    }

    public function request(ApiRequest $request)
    {
        $this->request = $request;
    }

    public function requestedFields(array $requestedFields)
    {
        $this->requestedFields[] = $requestedFields;
    }
}