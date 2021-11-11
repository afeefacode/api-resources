<?php

namespace Afeefa\ApiResources\Test;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionBag;
use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Resource\ResourceBag;
use Afeefa\ApiResources\Type\Type;
use Closure;

function T(string $type, bool $create = true): ?string
{
    // find container entry of Type::class with type() === type
    $container = ApiResourcesTest::$staticContainer;
    $entries = $container->entries();
    foreach (array_keys($entries) as $Class) {
        if (is_subclass_of($Class, Type::class)) {
            if ($Class::type() === $type) {
                return $Class;
            }
        }
    }

    if ($create) {
        // no entry found, create one
        $type = (new TypeBuilder($container))->type($type)->get();
        return $type::class;
    }

    return null;
}

function createApiWithSingleType(
    string $typeName = 'Test.Type',
    ?Closure $fieldsCallback = null,
    ?Closure $actionsCallback = null
): Api {
    $container = ApiResourcesTest::$staticContainer;
    (new TypeBuilder($container))->type($typeName, $fieldsCallback)->get();

    if (!$actionsCallback) {
        $actionsCallback = function (ActionBag $actions) use ($typeName) {
            $actions->add('test_action', function (Action $action) use ($typeName) {
                $action->response(T($typeName));
                $action->resolve(function () {
                });
            });
        };
    }

    return createApiWithSingleResource($actionsCallback);
}

function createApiWithSingleResource(?Closure $actionsCallback = null): Api
{
    $container = ApiResourcesTest::$staticContainer;
    $resource = (new ResourceBuilder($container))
        ->resource('Test.Resource', $actionsCallback)
        ->get();

    return (new ApiBuilder($container))
        ->api(
            'Test.Api',
            function (ResourceBag $resources) use ($resource) {
                $resources->add($resource::class);
            }
        )
        ->get();
}
