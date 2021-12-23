<?php

namespace Afeefa\ApiResources\Tests\Resolver;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackException;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Resolver\MutationActionResolver;
use Afeefa\ApiResources\Resolver\MutationRelationResolver;
use Afeefa\ApiResources\Test\ApiResourcesTest;
use function Afeefa\ApiResources\Test\T;

use Afeefa\ApiResources\Type\Type;

use Closure;

class MutationRelationResolverTest extends ApiResourcesTest
{
    private TestWatcher $testWatcher;

    protected function setUp(): void
    {
        parent::setup();

        $this->testWatcher = new TestWatcher();
    }

    /**
     * @dataProvider hasMissingCallbackDataprovider
     */
    public function test_has_missing_get($TypeOrTypes)
    {
        $this->expectException(MissingCallbackException::class);
        $this->expectExceptionMessage('Resolver for relation other needs to implement a get() method.');

        $api = $this->createApiWithType(
            function (FieldBag $fields) use ($TypeOrTypes) {
                $fields
                    ->relation('other', $TypeOrTypes(), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => []]);
    }

    /**
     * @dataProvider hasMissingCallbackDataprovider
     */
    public function test_has_missing_add($TypeOrTypes)
    {
        $this->expectException(MissingCallbackException::class);
        $this->expectExceptionMessage('Resolver for relation other needs to implement an add() method.');

        $api = $this->createApiWithType(
            function (FieldBag $fields) use ($TypeOrTypes) {
                $fields
                    ->relation('other', $TypeOrTypes(), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r->get(fn () => null);
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => []]);
    }

    /**
     * @dataProvider hasMissingCallbackDataprovider
     */
    public function test_has_missing_update($TypeOrTypes)
    {
        $this->expectException(MissingCallbackException::class);
        $this->expectExceptionMessage('Resolver for relation other needs to implement an update() method.');

        $api = $this->createApiWithType(
            function (FieldBag $fields) use ($TypeOrTypes) {
                $fields
                    ->relation('other', $TypeOrTypes(), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(fn () => null)
                                ->add(fn () => null);
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => []]);
    }

    /**
     * @dataProvider hasMissingCallbackDataprovider
     */
    public function test_has_missing_delete($TypeOrTypes)
    {
        $this->expectException(MissingCallbackException::class);
        $this->expectExceptionMessage('Resolver for relation other needs to implement a delete() method.');

        $api = $this->createApiWithType(
            function (FieldBag $fields) use ($TypeOrTypes) {
                $fields
                    ->relation('other', $TypeOrTypes(), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(fn () => null)
                                ->add(fn () => null)
                                ->update(fn () => null);
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => []]);
    }

    /**
     * @dataProvider hasMissingCallbackDataprovider
     */
    public function test_has_with_all_callbacks()
    {
        $api = $this->createApiWithType(
            function (FieldBag $fields) {
                $fields
                    ->relation('other', T('TYPE'), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(fn () => null)
                                ->add(fn () => null)
                                ->update(fn () => null)
                                ->delete(fn () => null);
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => []]);

        $this->assertTrue(true);
    }

    public function hasMissingCallbackDataprovider()
    {
        return [
            'has_one' => [fn () => T('TYPE')],
            'has_many' => [fn () => Type::list(T('TYPE'))]
        ];
    }

    /**
     * @dataProvider hasOneAddDataProvider
     */
    public function test_has_one_add($data, $expectedInfo, $expectedInfo2, $expectedSaveFields)
    {
        $api = $this->createApiWithType(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)
                    ->relation('other', T('TYPE'), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(function () {
                                    $this->testWatcher->info('get');
                                })
                                ->add(function (ModelInterface $owner, string $typeName, array $saveFields) use ($r) {
                                    $this->testWatcher->info('add');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $typeName,
                                        $r->getRelation()->getName()
                                    ]);

                                    $this->testWatcher->saveFields($saveFields);
                                })
                                ->update(function () {
                                    $this->testWatcher->info('update');
                                })
                                ->delete(function () {
                                    $this->testWatcher->info('delete');
                                });
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => $data]);

        $this->assertEquals($expectedInfo, $this->testWatcher->info);
        $this->assertEquals($expectedInfo2, $this->testWatcher->info2);
        $this->assertEquals($expectedSaveFields, $this->testWatcher->saveFields);
    }

    public function hasOneAddDataProvider()
    {
        return [
            'null_do_nothing' => [
                null,
                ['get'],
                [],
                []
            ],

            'empty_data' => [
                [],
                ['get', 'add'],
                [['111333', 'TYPE', 'TYPE', 'other']],
                [[]]
            ],

            'unknown_field' => [
                ['a' => 'b'],
                ['get', 'add'],
                [['111333', 'TYPE', 'TYPE', 'other']],
                [[]]
            ],

            'valid_field' => [
                ['name' => 'name1'],
                ['get', 'add'],
                [['111333', 'TYPE', 'TYPE', 'other']],
                [['name' => 'name1']]
            ],

            'valid_field_with_id' => [
                ['id' => '4', 'name' => 'name1'],
                ['get', 'add'],
                [['111333', 'TYPE', 'TYPE', 'other']],
                [['name' => 'name1']]
            ]
        ];
    }

    private $test_has_one_update_existingData = [];

    /**
     * @dataProvider hasOneUpdateDataProvider
     */
    public function test_has_one_update($existingData, $data, $expectedInfo, $expectedInfo2, $expectedSaveFields)
    {
        $this->test_has_one_update_existingData = $existingData;

        $api = $this->createApiWithType(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)
                    ->relation('other', T('TYPE'), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(function () {
                                    $this->testWatcher->info('get');
                                    return Model::fromSingle('TYPE', $this->test_has_one_update_existingData);
                                })
                                ->add(function () {
                                    $this->testWatcher->info('add');
                                })
                                ->update(function (ModelInterface $owner, ModelInterface $modelToUpdate, array $saveFields) use ($r) {
                                    $this->testWatcher->info('update');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $modelToUpdate->apiResourcesGetId(),
                                        $modelToUpdate->apiResourcesGetType(),
                                        $r->getRelation()->getName()
                                    ]);

                                    $this->testWatcher->saveFields($saveFields);
                                })
                                ->delete(function () {
                                    $this->testWatcher->info('delete');
                                });
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => $data]);

        $this->assertEquals($expectedInfo, $this->testWatcher->info);
        $this->assertEquals([$expectedInfo2], $this->testWatcher->info2);
        $this->assertEquals([$expectedSaveFields], $this->testWatcher->saveFields);
    }

    public function hasOneUpdateDataProvider()
    {
        return [
            'empty_data' => [
                [],
                [],
                ['get', 'update'],
                ['111333', 'TYPE', null, 'TYPE', 'other'],
                []
            ],

            'empty_data_with_id' => [
                ['id' => '123', 'title' => 'test'],
                [],
                ['get', 'update'],
                ['111333', 'TYPE', '123', 'TYPE', 'other'],
                []
            ],

            'unknown_field' => [
                [],
                ['a' => 'b'],
                ['get', 'update'],
                ['111333', 'TYPE', null, 'TYPE', 'other'],
                []
            ],

            'valid_field' => [
                [],
                ['name' => 'name1'],
                ['get', 'update'],
                ['111333', 'TYPE', null, 'TYPE', 'other'],
                ['name' => 'name1']
            ],

            'valid_field_with_id' => [
                [],
                ['id' => '10', 'name' => 'name1'],
                ['get', 'update'],
                ['111333', 'TYPE', null, 'TYPE', 'other'],
                ['name' => 'name1']
            ]
        ];
    }

    private $test_has_one_delete_existingData = [];

    /**
     * @dataProvider hasOneDeleteDataProvider
     */
    public function test_has_one_delete($existingData, $data, $expectedInfo, $expectedInfo2)
    {
        $this->test_has_one_delete_existingData = $existingData;

        $api = $this->createApiWithType(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)
                    ->relation('other', T('TYPE'), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(function () {
                                    $this->testWatcher->info('get');
                                    return Model::fromSingle('TYPE', $this->test_has_one_delete_existingData);
                                })
                                ->add(function () {
                                    $this->testWatcher->info('add');
                                })
                                ->update(function () use ($r) {
                                    $this->testWatcher->info('update');
                                })
                                ->delete(function (ModelInterface $owner, ModelInterface $modelToDelete) use ($r) {
                                    $this->testWatcher->info('delete');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $modelToDelete->apiResourcesGetId(),
                                        $modelToDelete->apiResourcesGetType(),
                                        $r->getRelation()->getName()
                                    ]);
                                });
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => $data]);

        $this->assertEquals($expectedInfo, $this->testWatcher->info);
        $this->assertEquals([$expectedInfo2], $this->testWatcher->info2);
    }

    public function hasOneDeleteDataProvider()
    {
        return [
            'without_id' => [
                [],
                null,
                ['get', 'delete'],
                ['111333', 'TYPE', null, 'TYPE', 'other'],
                []
            ],

            'with_id' => [
                ['id' => '10'],
                null,
                ['get', 'delete'],
                ['111333', 'TYPE', '10', 'TYPE', 'other'],
                []
            ]
        ];
    }

    private $test_has_many_existingData = [];

    /**
     * @dataProvider hasManyDataProvider
     */
    public function test_has_many($existingData, $data, $expectedInfo, $expectedInfo2, $expectedSaveFields)
    {
        $this->test_has_many_existingData = $existingData;

        $api = $this->createApiWithType(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)
                    ->relation('other', Type::list(T('TYPE')), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(function () {
                                    $this->testWatcher->info('get');
                                    if ($this->test_has_many_existingData) {
                                        return Model::fromList('TYPE', $this->test_has_many_existingData);
                                    }
                                    return [];
                                })
                                ->add(function (ModelInterface $owner, string $typeName, array $saveFields) use ($r) {
                                    $this->testWatcher->info('add');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $typeName,
                                        $r->getRelation()->getName()
                                    ]);

                                    $this->testWatcher->saveFields($saveFields);
                                })
                                ->update(function (ModelInterface $owner, ModelInterface $modelToUpdate, array $saveFields) use ($r) {
                                    $this->testWatcher->info('update');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $modelToUpdate->apiResourcesGetId(),
                                        $modelToUpdate->apiResourcesGetType(),
                                        $r->getRelation()->getName()
                                    ]);

                                    $this->testWatcher->saveFields($saveFields);
                                })
                                ->delete(function (ModelInterface $owner, ModelInterface $modelToDelete) use ($r) {
                                    $this->testWatcher->info('delete');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $modelToDelete->apiResourcesGetId(),
                                        $modelToDelete->apiResourcesGetType(),
                                        $r->getRelation()->getName()
                                    ]);
                                });
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => $data]);

        $this->assertEquals($expectedInfo, $this->testWatcher->info);
        $this->assertEquals($expectedInfo2, $this->testWatcher->info2);
        $this->assertEquals($expectedSaveFields, $this->testWatcher->saveFields);
    }

    public function hasManyDataProvider()
    {
        // $existingData, $data, $expectedInfo, $expectedInfo2, $expectedSaveFields
        return [
            'new_empty' => [
                [],
                [],
                ['get'],
                [],
                []
            ],

            'new_unknown_field' => [
                [],
                [['a' => 'b']],
                ['get', 'add'],
                [['111333', 'TYPE', 'TYPE', 'other']],
                [[]]
            ],

            'new_valid_field_no_id' => [
                [],
                [['name' => 'name1']],
                ['get', 'add'],
                [['111333', 'TYPE', 'TYPE', 'other']],
                [['name' => 'name1']]
            ],

            'new_valid_field_with_id' => [
                [],
                [['id' => '4', 'name' => 'name1']],
                ['get', 'add'],
                [['111333', 'TYPE', 'TYPE', 'other']],
                [['name' => 'name1']]
            ],

            'existing_empty' => [
                [['id' => '10'], ['id' => '11']],
                [],
                ['get', 'delete', 'delete'],
                [['111333', 'TYPE', '10', 'TYPE', 'other'], ['111333', 'TYPE', '11', 'TYPE', 'other']],
                []
            ],

            'existing_unknown_field' => [
                [['id' => '10'], ['id' => '11']],
                [['a' => 'b', 'name' => 'nameb'], ['id' => '11', 'name' => 'name11']],
                ['get', 'delete', 'add', 'update'],
                [
                    ['111333', 'TYPE', '10', 'TYPE', 'other'],
                    ['111333', 'TYPE', 'TYPE', 'other'],
                    ['111333', 'TYPE', '11', 'TYPE', 'other']
                ],
                [
                    ['name' => 'nameb'],
                    ['name' => 'name11']
                ]
            ],

            'delete_not_present' => [
                [['id' => '10'], ['id' => '11']],
                [['id' => '11', 'name' => 'name11']],
                ['get', 'delete', 'update'],
                [['111333', 'TYPE', '10', 'TYPE', 'other'], ['111333', 'TYPE', '11', 'TYPE', 'other']],
                [['name' => 'name11']]
            ],

            'delete_add' => [
                [['id' => '10']],
                [['id' => '4', 'name' => 'name4']],
                ['get', 'delete', 'add'],
                [['111333', 'TYPE', '10', 'TYPE', 'other'], ['111333', 'TYPE', 'TYPE', 'other']],
                [['name' => 'name4']]
            ],

            'keep' => [
                [['id' => '4'], ['id' => '5']],
                [['id' => '4', 'name' => 'name4'], ['id' => '5', 'name' => 'name5']],
                ['get', 'update', 'update'],
                [['111333', 'TYPE', '4', 'TYPE', 'other'], ['111333', 'TYPE', '5', 'TYPE', 'other']],
                [
                    ['name' => 'name4'],
                    ['name' => 'name5']
                ]
            ],

            'keep_delete_add' => [
                [['id' => '4'], ['id' => '5'], ['id' => '6'], ['id' => '7']],
                [
                    ['id' => '4', 'name' => 'name4'],
                    ['id' => '5', 'name' => 'name5'],
                    ['id' => '8', 'name' => 'name8'],
                    ['id' => '9', 'name' => 'name9']
                ],
                ['get', 'delete', 'delete', 'update', 'update', 'add', 'add'],
                [
                    ['111333', 'TYPE', '6', 'TYPE', 'other'], ['111333', 'TYPE', '7', 'TYPE', 'other'],
                    ['111333', 'TYPE', '4', 'TYPE', 'other'], ['111333', 'TYPE', '5', 'TYPE', 'other'],
                    ['111333', 'TYPE', 'TYPE', 'other'], ['111333', 'TYPE', 'TYPE', 'other']
                ],
                [
                    ['name' => 'name4'],
                    ['name' => 'name5'],
                    ['name' => 'name8'],
                    ['name' => 'name9']
                ]
            ]
        ];
    }

    /**
     * @dataProvider linkMissingCallbackDataprovider
     */
    public function test_link_one_missing_get($TypeOrTypes)
    {
        $this->expectException(MissingCallbackException::class);
        $this->expectExceptionMessage('Resolver for relation other needs to implement a get() method.');

        $api = $this->createApiWithType(
            function (FieldBag $fields) use ($TypeOrTypes) {
                $fields
                    ->relation('other', $TypeOrTypes(), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => []]);
    }

    /**
     * @dataProvider linkMissingCallbackDataprovider
     */
    public function test_link_one_missing_link($TypeOrTypes)
    {
        $this->expectException(MissingCallbackException::class);
        $this->expectExceptionMessage('Resolver for relation other needs to implement a link() method.');

        $api = $this->createApiWithType(
            function (FieldBag $fields) use ($TypeOrTypes) {
                $fields
                    ->relation('other', $TypeOrTypes(), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r->get(fn () => null);
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => []]);
    }

    /**
     * @dataProvider linkMissingCallbackDataprovider
     */
    public function test_link_one_missing_unlink($TypeOrTypes)
    {
        $this->expectException(MissingCallbackException::class);
        $this->expectExceptionMessage('Resolver for relation other needs to implement an unlink() method.');

        $api = $this->createApiWithType(
            function (FieldBag $fields) use ($TypeOrTypes) {
                $fields
                    ->relation('other', $TypeOrTypes(), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(fn () => null)
                                ->link(fn () => null);
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => []]);
    }

    /**
     * @dataProvider linkMissingCallbackDataprovider
     */
    public function test_link_with_all_callbacks($TypeOrTypes)
    {
        $api = $this->createApiWithType(
            function (FieldBag $fields) use ($TypeOrTypes) {
                $fields
                    ->relation('other', $TypeOrTypes(), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(fn () => [])
                                ->link(fn () => null)
                                ->unlink(fn () => null);
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => []]);

        $this->assertTrue(true);
    }

    public function linkMissingCallbackDataprovider()
    {
        return [
            'link_one' => [fn () => Type::link(T('TYPE')), []],
            'link_many' => [fn () => Type::list(Type::link(T('TYPE'))), []]
        ];
    }

    private $test_link_one_link_existingData = [];

    /**
     * @dataProvider linkOneLinkDataProvider
     */
    public function test_link_one_link($existingData, $data, $expectedInfo, $expectedInfo2)
    {
        $this->test_link_one_link_existingData = $existingData;

        $api = $this->createApiWithType(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)
                    ->relation('other', Type::link(T('TYPE')), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(function () {
                                    $this->testWatcher->info('get');
                                    if ($this->test_link_one_link_existingData) {
                                        return Model::fromSingle('TYPE', $this->test_link_one_link_existingData);
                                    }
                                    return null;
                                })
                                ->link(function (ModelInterface $owner, ?string $id, string $typeName) use ($r) {
                                    $this->testWatcher->info('link');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $id,
                                        $typeName,
                                        $r->getRelation()->getName()
                                    ]);
                                })
                                ->unlink(function (ModelInterface $owner, ModelInterface $modelToUnlink) use ($r) {
                                    $this->testWatcher->info('unlink');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $modelToUnlink->apiResourcesGetId(),
                                        $modelToUnlink->apiResourcesGetType(),
                                        $r->getRelation()->getName()
                                    ]);
                                });
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => $data]);

        $this->assertEquals($expectedInfo, $this->testWatcher->info);
        $this->assertEquals($expectedInfo2, $this->testWatcher->info2);
    }

    public function linkOneLinkDataProvider()
    {
        // $existingData, $data, $expectedInfo, $expectedInfo2
        return [
            'new_null' => [
                [],
                null,
                ['get'],
                []
            ],

            'new_empty_data' => [
                [],
                [],
                ['get'],
                []
            ],

            'new_unknown_field' => [
                [],
                ['a' => 'b'],
                ['get'],
                []
            ],

            'new_valid_field_no_id' => [
                [],
                ['name' => 'name1'],
                ['get'],
                []
            ],

            'new_valid_field_with_id' => [
                [],
                ['id' => '4', 'name' => 'name1'],
                ['get', 'link'],
                [['111333', 'TYPE', '4', 'TYPE', 'other']]
            ],

            'existing_null' => [
                ['id' => '10'],
                null,
                ['get', 'unlink'],
                [['111333', 'TYPE', '10', 'TYPE', 'other']]
            ],

            'existing_empty_data' => [
                ['id' => '10'],
                [],
                ['get'],
                []
            ],

            'existing_unknown_field' => [
                ['id' => '10'],
                ['a' => 'b'],
                ['get'],
                []
            ],

            'existing_valid_field_no_id' => [
                ['id' => '10'],
                ['name' => 'name1'],
                ['get'],
                []
            ],

            'existing_valid_field_with_id' => [
                ['id' => '10'],
                ['id' => '4', 'name' => 'name1'],
                ['get', 'unlink', 'link'],
                [
                    ['111333', 'TYPE', '10', 'TYPE', 'other'],
                    ['111333', 'TYPE', '4', 'TYPE', 'other']
                ]
            ],

            'existing_valid_field_same_id' => [
                ['id' => '4'],
                ['id' => '4', 'name' => 'name1'],
                ['get'],
                []
            ]
        ];
    }

    private $test_link_many_link_existingData = [];

    /**
     * @dataProvider linkManyLinkDataProvider
     */
    public function test_link_many_link($existingData, $data, $expectedInfo, $expectedInfo2)
    {
        $this->test_link_many_link_existingData = $existingData;

        $api = $this->createApiWithType(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)
                    ->relation('other', Type::list(Type::link(T('TYPE'))), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(function () {
                                    $this->testWatcher->info('get');
                                    if ($this->test_link_many_link_existingData) {
                                        return Model::fromList('TYPE', $this->test_link_many_link_existingData);
                                    }
                                    return [];
                                })
                                ->link(function (ModelInterface $owner, ?string $id, string $typeName) use ($r) {
                                    $this->testWatcher->info('link');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $id,
                                        $typeName,
                                        $r->getRelation()->getName()
                                    ]);
                                })
                                ->unlink(function (ModelInterface $owner, ModelInterface $modelToUnlink) use ($r) {
                                    $this->testWatcher->info('unlink');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $modelToUnlink->apiResourcesGetId(),
                                        $modelToUnlink->apiResourcesGetType(),
                                        $r->getRelation()->getName()
                                    ]);
                                });
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => $data]);

        $this->assertEquals($expectedInfo, $this->testWatcher->info);
        $this->assertEquals($expectedInfo2, $this->testWatcher->info2);
    }

    public function linkManyLinkDataProvider()
    {
        // $existingData, $data, $expectedInfo, $expectedInfo2
        return [
            'new_empty' => [
                [],
                [],
                ['get'],
                []
            ],

            'new_unknown_field' => [
                [],
                [['a' => 'b']],
                ['get'],
                []
            ],

            'new_valid_field_no_id' => [
                [],
                [['name' => 'name1']],
                ['get'],
                []
            ],

            'new_valid_field_with_id' => [
                [],
                [['id' => '4', 'name' => 'name1']],
                ['get', 'link'],
                [['111333', 'TYPE', '4', 'TYPE', 'other']]
            ],

            'existing_empty' => [
                [['id' => '10'], ['id' => '11']],
                [],
                ['get', 'unlink', 'unlink'],
                [['111333', 'TYPE', '10', 'TYPE', 'other'], ['111333', 'TYPE', '11', 'TYPE', 'other']]
            ],

            'existing_unknown_field' => [
                [['id' => '10'], ['id' => '11']],
                [['a' => 'b'], ['id' => '11']],
                ['get', 'unlink'],
                [['111333', 'TYPE', '10', 'TYPE', 'other']]
            ],

            'unlink_not_present' => [
                [['id' => '10'], ['id' => '11']],
                [['id' => '11']],
                ['get', 'unlink'],
                [['111333', 'TYPE', '10', 'TYPE', 'other']]
            ],

            'unlink_link' => [
                [['id' => '10']],
                [['id' => '4']],
                ['get', 'unlink', 'link'],
                [['111333', 'TYPE', '10', 'TYPE', 'other'], ['111333', 'TYPE', '4', 'TYPE', 'other']]
            ],

            'keep' => [
                [['id' => '4'], ['id' => '5']],
                [['id' => '4'], ['id' => '5']],
                ['get'],
                []
            ],

            'keep_unlink_link' => [
                [['id' => '4'], ['id' => '5'], ['id' => '6'], ['id' => '7']],
                [['id' => '4'], ['id' => '5'], ['id' => '8'], ['id' => '9']],
                ['get', 'unlink', 'unlink', 'link', 'link'],
                [
                    ['111333', 'TYPE', '6', 'TYPE', 'other'], ['111333', 'TYPE', '7', 'TYPE', 'other'],
                    ['111333', 'TYPE', '8', 'TYPE', 'other'], ['111333', 'TYPE', '9', 'TYPE', 'other']
                ]
            ]
        ];
    }

    /**
     * @dataProvider getDataProvider
     */
    public function test_get($expectedInfo, $expectedInfo2)
    {
        $api = $this->createApiWithType(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)
                    ->relation('other', T('TYPE'), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->get(function (ModelInterface $owner) use ($r) {
                                    $this->testWatcher->info('get');

                                    $this->testWatcher->info2([
                                        $owner->apiResourcesGetId(),
                                        $owner->apiResourcesGetType(),
                                        $r->getRelation()->getName()
                                    ]);
                                })
                                ->link(fn () => null)
                                ->unlink(fn () => null)
                                ->add(fn () => null)
                                ->update(fn () => null)
                                ->delete(fn () => null);
                        });
                    });
            }
        );

        $this->request($api, data: ['other' => []]);

        $this->assertEquals($expectedInfo, $this->testWatcher->info);
        $this->assertEquals($expectedInfo2, $this->testWatcher->info2);
    }

    public function getDataProvider()
    {
        return [
            'link_one' => [
                ['get'],
                [['111333', 'TYPE', 'other']]
            ],

        ];
    }

    /**
     * @dataProvider getSaveBeforeOwnerDataProvider
     */
    public function test_get_save_before_owner($data, $expectedInfo, $expectedInfo2)
    {
        $api = $this->createApiWithType(
            function (FieldBag $fields) {
                $fields
                    ->attribute('name', VarcharAttribute::class)
                    ->relation('other', T('TYPE'), function (Relation $relation) {
                        $relation->resolveSave(function (MutationRelationResolver $r) {
                            $r
                                ->resolveBeforeOwner(function () {
                                    return [
                                        'id' => 'related_id',
                                        'type' => 'related_type'
                                    ];
                                })
                                ->get(function (?ModelInterface $owner) use ($r) {
                                    $this->testWatcher->info('get_related');

                                    $this->testWatcher->info2([
                                        $owner ? $owner->apiResourcesGetId() : null,
                                        $owner ? $owner->apiResourcesGetType() : null,
                                        $r->getRelation()->getName()
                                    ]);
                                })
                                ->add(function (?ModelInterface $owner, string $typeName, array $relatedData) use ($r) {
                                    $this->testWatcher->info('add_related');

                                    $this->testWatcher->info2([
                                        $owner ? $owner->apiResourcesGetId() : null,
                                        $owner ? $owner->apiResourcesGetType() : null,
                                        $typeName,
                                        $r->getRelation()->getName()
                                    ]);
                                })
                                ->update(fn () => null)
                                ->delete(fn () => null);
                        });
                    });
            },
            isset($data['id']) ? function (string $id, string $typeName) {
                $this->testWatcher->info('get_owner');
                return Model::fromSingle($typeName, ['id' => $id]);
            } : null
        );

        $this->request($api, data: $data);

        $this->assertEquals($expectedInfo, $this->testWatcher->info);
        $this->assertEquals($expectedInfo2, $this->testWatcher->info2);
    }

    public function getSaveBeforeOwnerDataProvider()
    {
        // $data, $expectedInfo, $expectedInfo2
        return [
            'with_owner_update' => [
                ['id' => '123', 'other' => []],
                ['get_owner', 'get_related', 'add_related'],
                [['123', 'TYPE', 'other'], ['123', 'TYPE', 'TYPE',  'other']]
            ],

            'without_owner_create' => [
                ['other' => []],
                ['get_related', 'add_related'],
                [[null, null, 'other'], [null, null, 'TYPE', 'other']]
            ]
        ];
    }

    private function createApiWithType(Closure $fieldsCallback, ?Closure $getCallback = null): Api
    {
        return $this->apiBuilder()->api('API', function (Closure $addResource, Closure $addType) use ($fieldsCallback, $getCallback) {
            $addType('TYPE', $fieldsCallback);
            $addResource('RES', function (Closure $addAction) use ($getCallback) {
                $addAction('ACT', function (Action $action) use ($getCallback) {
                    $action
                        ->input(T('TYPE'))
                        ->response(T('TYPE'))
                        ->resolve(function (MutationActionResolver $r) use ($getCallback) {
                            if ($getCallback) {
                                $r->get($getCallback);
                            }
                            $r->save(function () {
                                return TestModel::fromSingle('TYPE', ['id' => '111333']);
                            });
                        });
                });
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
