<?php

namespace Afeefa\ApiResources\Tests\Resolver;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Resolver\MutationActionResolver;
use Afeefa\ApiResources\Resolver\MutationRelationResolver;
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

    private $test_update_is_wrong_id = false;

    /**
     * @dataProvider updateDataProvider
     */
    public function test_update($fields, $expectedInfo, $expectedFields)
    {
        if (($fields['id'] ?? null) === '1234') {
            $this->test_update_is_wrong_id = true;

            $this->expectException(InvalidConfigurationException::class);
            $this->expectExceptionMessage('Get callback of mutation resolver for action ACT on resource RES must return a ModelInterface object.');
        }

        $api = $this->createApiWithTypeAndAction(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class);
            },
            function (Action $action) {
                $action
                    ->input(T('TYPE'))
                    ->response(T('TYPE'))
                    ->resolve(function (MutationActionResolver $r) {
                        $r
                            ->get(function () {
                                $this->testWatcher->info('get');
                                if (!$this->test_update_is_wrong_id) {
                                    return TestModel::fromSingle('TYPE', []);
                                }
                            })
                            ->save(function () use ($r) {
                                $this->testWatcher->info('save');
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

        $this->assertEquals($expectedInfo, $this->testWatcher->info);
        $this->assertEquals($expectedFields, $this->testWatcher->saveFields);
    }

    public function updateDataProvider()
    {
        // [data fields, save fields]
        return [
            'with_id' => [
                ['id' => '123', 'name' => 'hase'],
                ['get', 'save'],
                [['name' => 'hase']]
            ],

            'with_wrong_id' => [
                ['id' => '1234', 'name' => 'hase'],
                [],
                []
            ],

            'without_id' => [
                ['name' => 'hase'],
                ['save'],
                [['name' => 'hase']]
            ]
        ];
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
                    ->input(T('TYPE'))
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

            'empty' => [[], []],

            'unknown_relation' => [
                ['relation' => ['field' => true]],
                []
            ]
        ];
    }

    private bool $deleteBeforeAdd = false;

    /**
     * @dataProvider saveRelationsDataProvider
     */
    public function test_save_fields_relations($fields, $delete, $expectedFields, $expectedOrder)
    {
        $this->deleteBeforeAdd = $delete;

        $api = $this->createApiWithTypeAndAction(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)
                    ->attribute('title', VarcharAttribute::class)
                    ->relation('relation', T('TYPE'), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(function () {
                                    $this->testWatcher->info('relation_get');
                                    if ($this->deleteBeforeAdd) {
                                        return Model::fromSingle('TYPE', ['id' => '9']);
                                    }
                                })
                                ->add(function ($owner, $type, $saveFields) {
                                    $this->testWatcher->info('relation_add');
                                    $this->testWatcher->saveFields($saveFields);
                                })
                                ->update(fn () => null)
                                ->delete(function () {
                                    $this->testWatcher->info('relation_delete');
                                });
                        });
                    })
                    ->relation('relation_before', T('TYPE'), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->resolveBeforeOwner(function () {
                                    return [
                                        'id' => 'related_id',
                                        'type' => 'related_type'
                                    ];
                                })
                                ->get(function () {
                                    $this->testWatcher->info('relation_before_get');
                                    if ($this->deleteBeforeAdd) {
                                        return Model::fromSingle('TYPE', ['id' => '9']);
                                    }
                                })
                                ->add(function ($owner, $type, $saveFields) {
                                    $this->testWatcher->info('relation_before_add');
                                    $this->testWatcher->saveFields($saveFields);
                                    return Model::fromSingle('TYPE', ['id' => '10']);
                                })
                                ->update(fn () => null)
                                ->delete(function () {
                                    $this->testWatcher->info('relation_before_delete');
                                });
                        });
                    })
                    ->relation('relation_after', T('TYPE'), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->resolveAfterOwner(function () {
                                    return [
                                        'id' => 'owner_id',
                                        'type' => 'owner_type'
                                    ];
                                })
                                ->get(function () {
                                    $this->testWatcher->info('relation_after_get');
                                    if ($this->deleteBeforeAdd) {
                                        return Model::fromSingle('TYPE', ['id' => '9']);
                                    }
                                })
                                ->add(function ($owner, $type, $saveFields) use ($r) {
                                    $this->testWatcher->info('relation_after_add');
                                    $this->testWatcher->saveFields($saveFields);
                                })
                                ->update(fn () => null)
                                ->delete(function () {
                                    $this->testWatcher->info('relation_after_delete');
                                });
                        });
                    });
            },
            function (Action $action) {
                $action
                    ->input(T('TYPE'))
                    ->response(T('TYPE'))
                    ->resolve(function (MutationActionResolver $r) {
                        $r->save(function () use ($r) {
                            $this->testWatcher->saveFields($r->getSaveFields());
                            $this->testWatcher->info('owner');
                            return TestModel::fromSingle('TYPE', ['id' => '3']);
                        });
                    });
            }
        );

        $this->request(
            $api,
            data: $fields
        );

        $this->assertEquals($expectedFields, $this->testWatcher->saveFields);

        $this->assertEquals($expectedOrder, $this->testWatcher->info);
    }

    public function saveRelationsDataProvider()
    {
        // [requested fields, get relation, expected save fields, resolve order]
        $data = [
            'name' => [
                ['name' => 'name1', 'relation' => ['name' => 'name2']],
                false,
                [
                    ['name' => 'name1'],
                    ['name' => 'name2']
                ],
                ['owner', 'relation_get', 'relation_add']
            ],

            'before_owner' => [
                ['name' => 'name1', 'relation_before' => ['name' => 'name2']],
                false,
                [
                    ['name' => 'name2'],
                    ['name' => 'name1', 'related_id' => '10', 'related_type' => 'TYPE']
                ],
                ['relation_before_get', 'relation_before_add', 'owner']
            ],

            'before_owner_null' => [
                ['name' => 'name1', 'relation_before' => null],
                false,
                [
                    ['name' => 'name1', 'related_id' => null, 'related_type' => null]
                ],
                ['relation_before_get', 'owner']
            ],

            'after_owner' => [
                ['name' => 'name1', 'relation_after' => ['name' => 'name3']],
                false,
                [
                    ['name' => 'name1'],
                    ['owner_id' => '3', 'owner_type' => 'TYPE', 'name' => 'name3']
                ],
                ['owner', 'relation_after_get', 'relation_after_add']
            ],

            'after_owner_null' => [
                ['name' => 'name1', 'relation_after' => null],
                false,
                [
                    ['name' => 'name1']
                ],
                ['owner', 'relation_after_get']
            ],

            'all' => [
                [
                    'name' => 'name1',
                    'relation' => ['name' => 'name2'],
                    'relation_before' => ['name' => 'name2'],
                    'relation_after' => ['name' => 'name3']
                ],
                false,
                [
                    ['name' => 'name2'], // relation before
                    ['name' => 'name1', 'related_id' => '10', 'related_type' => 'TYPE'], // owner
                    ['name' => 'name2'], // relation
                    ['owner_id' => '3', 'owner_type' => 'TYPE', 'name' => 'name3'], // relation after
                ],
                ['relation_before_get', 'relation_before_add', 'owner', 'relation_get', 'relation_add', 'relation_after_get', 'relation_after_add']
            ],

            'all_null' => [
                [
                    'name' => 'name1',
                    'relation' => null,
                    'relation_before' => null,
                    'relation_after' => null
                ],
                false,
                [
                    ['name' => 'name1', 'related_id' => null, 'related_type' => null] // owner
                ],
                ['relation_before_get', 'owner', 'relation_get', 'relation_after_get']
            ],
        ];

        return $data;
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
                    ->input(T('TYPE'))
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

    private function request(Api $api, $data = 'unset'): array
    {
        return $api->request(function (ApiRequest $request) use ($data) {
            $request
                ->resourceType('RES')
                ->actionName('ACT');

            if ($data !== 'unset') {
                $request->fieldsToSave($data);
            }
        });
    }
}
