<?php

namespace Afeefa\ApiResources\Tests\DI;

use Afeefa\ApiResources\DI\Container;

use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackArgumentException;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeHintException;
use Afeefa\ApiResources\Exception\Exceptions\NotATypeException;
use Afeefa\ApiResources\Exception\Exceptions\NotATypeOrCallbackException;
use Afeefa\ApiResources\Exception\Exceptions\TooManyCallbackArgumentsException;
use Afeefa\ApiResources\Tests\DI\Fixtures\TestInterface;
use Afeefa\ApiResources\Tests\DI\Fixtures\TestModel;
use Afeefa\ApiResources\Tests\DI\Fixtures\TestService;
use Afeefa\ApiResources\Tests\DI\Fixtures\TestService2;
use Afeefa\ApiResources\Tests\DI\Fixtures\TestService3;
use PHPUnit\Framework\TestCase;

class ContainerTest extends TestCase
{
    public function test_create()
    {
        $container = new Container();

        $this->assertTrue($container->has(Container::class));

        $this->assertCount(1, $container->entries());

        $this->assertFalse($container->has(TestService::class));

        $this->assertSame($container, array_values($container->entries())[0]);
    }

    public function test_create_with_config_interface()
    {
        $config = [
            TestInterface::class => new TestService()
        ];

        $container = new Container($config);

        $this->assertCount(1, $container->entries());
        $this->assertTrue($container->has(Container::class));
        $this->assertFalse($container->has(TestInterface::class));

        $container->get(TestInterface::class);

        $this->assertTrue($container->has(TestInterface::class));
    }

    public function test_create_with_config_interface_not_implements()
    {
        $this->expectException(NotATypeException::class);
        $this->expectExceptionMessage(TestInterface::class . ' can not be instantiated to create a new instance.');

        $TestService = new class () {};

        $config = [
            TestInterface::class => $TestService
        ];

        $container = new Container($config);

        $this->assertCount(1, $container->entries());
        $this->assertTrue($container->has(Container::class));
        $this->assertFalse($container->has(TestInterface::class));

        $container->get(TestInterface::class);
    }

    public function test_get_creates_entry()
    {
        $container = new Container();

        $service = $container->get(TestService::class);

        $this->assertNotNull($service);
        $this->assertInstanceOf(TestService::class, $service);

        $this->assertCount(2, $container->entries());

        $this->assertTrue($container->has(TestService::class));
    }

    public function test_get_does_not_create_entry_twice()
    {
        $container = new Container();

        $service = $container->get(TestService::class);
        $service->name = 'TestServiceNew';

        $service2 = $container->get(TestService::class);

        $this->assertSame($service, $service2);

        $this->assertSame('TestServiceNew', $service2->name);

        $this->assertCount(2, $container->entries());

        $this->assertTrue($container->has(TestService::class));
    }

    public function test_get_interface_cannot_be_created()
    {
        $this->expectException(NotATypeException::class);
        $this->expectExceptionMessage(TestInterface::class . ' can not be instantiated to create a new instance.');

        $container = new Container();

        $this->assertCount(1, $container->entries());
        $this->assertTrue($container->has(Container::class));
        $this->assertFalse($container->has(TestInterface::class));

        $container->get(TestInterface::class);
    }

    public function test_get_with_callback_closure()
    {
        $container = new Container();

        $service = $container->get(function (TestService $service) {
            // do something hiere
        });

        $this->assertNotNull($service);
        $this->assertInstanceOf(TestService::class, $service);

        $this->assertCount(2, $container->entries());

        $this->assertTrue($container->has(TestService::class));

        // callback in variable

        $callback = function (TestService $service) {
            // do something hiere
        };

        $service = $container->get($callback);

        $this->assertNotNull($service);
        $this->assertInstanceOf(TestService::class, $service);

        $this->assertCount(2, $container->entries());

        $this->assertTrue($container->has(TestService::class));

        // second argument in closure

        $service2 = $container->get(function (TestService $service, TestModel $model) {
            // do something hiere
        });

        $this->assertSame($service, $service2);

        $this->assertNotNull($service);
        $this->assertInstanceOf(TestService::class, $service);

        $this->assertCount(3, $container->entries());

        $this->assertTrue($container->has(TestService::class));
        $this->assertTrue($container->has(TestModel::class));
    }

    public function callbackCallablePublic(TestService $service)
    {
        // do something here
    }

    public function test_get_with_callback_callable()
    {
        $container = new Container();

        $service = $container->get([$this, 'callbackCallablePublic']);

        $this->assertNotNull($service);
        $this->assertInstanceOf(TestService::class, $service);

        $this->assertCount(2, $container->entries());

        $this->assertTrue($container->has(TestService::class));
    }

    protected function callbackCallableProtected(TestService $service)
    {
        // do something here
    }

    public function test_get_with_callback_callable_not_accessible()
    {
        $this->expectException(NotATypeOrCallbackException::class);
        $this->expectExceptionMessage('Argument is not a class or interface string: array');

        $container = new Container();

        $container->get([$this, 'callbackCallableProtected']);
    }

    public function test_get_with_callback_callable_invalid()
    {
        $this->expectException(NotATypeOrCallbackException::class);
        $this->expectExceptionMessage('Argument is not a class or interface string: array');

        $container = new Container();

        $container->get([$this, 'invalidMethodName']);
    }

    public function test_get_with_invalid_type()
    {
        $this->expectException(NotATypeOrCallbackException::class);
        $this->expectExceptionMessage('Argument is not a known class or interface: InvalidType');

        $container = new Container();

        $container->get('InvalidType');
    }

    public function test_get_with_callback_closure_missing_argument()
    {
        $this->expectException(MissingCallbackArgumentException::class);
        $this->expectExceptionMessage('Callback must provide more than 0 arguments.');

        $container = new Container();

        $container->get(function () {
            // do something hiere
        });
    }

    public function test_get_with_callback_closure_missing_type_hint()
    {
        $this->expectException(MissingTypeHintException::class);
        $this->expectExceptionMessage('Callback variable $hoho does provide a type hint.');

        $container = new Container();

        $container->get(function ($hoho) {
            // do something hiere
        });
    }

    public function test_get_with_callback_closure_multiple_arguments()
    {
        $container = new Container();

        $service = $container->get(function (TestService $service, TestModel $model) {
            // do something hiere
        });

        $this->assertInstanceOf(TestService::class, $service);

        $this->assertCount(3, $container->entries());

        $this->assertTrue($container->has(TestService::class));
        $this->assertTrue($container->has(TestModel::class));

        $this->assertSame($service, array_values($container->entries())[1]);
        $this->assertInstanceOf(TestModel::class, array_values($container->entries())[2]);

        // again

        $model = $container->get(function (TestModel $model, TestService $service) {
            // do something hiere
        });

        $this->assertInstanceOf(TestModel::class, $model);

        $this->assertCount(3, $container->entries());

        $this->assertTrue($container->has(TestService::class));
        $this->assertTrue($container->has(TestModel::class));

        $this->assertInstanceOf(TestService::class, array_values($container->entries())[1]);
        $this->assertSame($model, array_values($container->entries())[2]);
    }

    public function test_get_with_callback_closure_multiple_arguments2()
    {
        $container = new Container();

        $called = false;
        $s = null;
        $m = null;

        $service = $container->get(function (TestService $service, TestModel $model) use (&$called, &$s, &$m) {
            $s = $service;
            $m = $model;
            $called = true;
        });

        $this->assertTrue($called);

        $this->assertCount(3, $container->entries());
        $this->assertSame($service, $s);
        $this->assertSame(array_values($container->entries())[2], $m);

        $called = false;
        $s2 = null;
        $m2 = null;

        $service = $container->get(function (TestService $service, TestModel $model) use (&$called, &$s2, &$m2) {
            $s2 = $service;
            $m2 = $model;
            $called = true;
        });

        $this->assertTrue($called);

        $this->assertCount(3, $container->entries());
        $this->assertSame($s, $s2);
        $this->assertSame($m, $m2);
        $this->assertSame(array_values($container->entries())[2], $m);
    }

    public function test_create_creates_instance()
    {
        $container = new Container();

        $service = $container->create(TestService::class);

        $this->assertNotNull($service);
        $this->assertInstanceOf(TestService::class, $service);

        $this->assertCount(1, $container->entries());

        $this->assertFalse($container->has(TestService::class));
    }

    public function test_create_creates_instances()
    {
        $container = new Container();

        $service = $container->create(TestService::class);
        $service2 = $container->create(TestService::class);
        $service3 = $container->create(TestService::class);

        $this->assertInstanceOf(TestService::class, $service);
        $this->assertInstanceOf(TestService::class, $service2);
        $this->assertInstanceOf(TestService::class, $service3);

        $this->assertNotSame($service, $service2);
        $this->assertNotSame($service, $service3);
        $this->assertNotSame($service2, $service3);

        $this->assertCount(1, $container->entries());

        $this->assertFalse($container->has(TestService::class));
    }

    public function test_create_interface()
    {
        $this->expectException(NotATypeException::class);
        $this->expectExceptionMessage(TestInterface::class . ' can not be instantiated to create a new instance.');

        $container = new Container();
        $container->create(TestInterface::class);
    }

    public function test_create_interface2()
    {
        $this->expectException(NotATypeException::class);
        $this->expectExceptionMessage(TestInterface::class . ' can not be instantiated to create a new instance.');

        $container = new Container([
            TestInterface::class => new TestService()
        ]);

        $container->create(TestInterface::class);
    }

    public function test_create_with_callback_closure()
    {
        $container = new Container();

        $service = $container->create(function (TestService $service) {
            // do something hiere
        });

        $this->assertInstanceOf(TestService::class, $service);

        // callback in variable

        $callback = function (TestService $service) {
            // do something hiere
        };

        $service2 = $container->get($callback);

        $this->assertInstanceOf(TestService::class, $service);

        $this->assertNotSame($service, $service2);
    }

    public function test_create_with_callback_closure_multiple_arguments()
    {
        $this->expectException(TooManyCallbackArgumentsException::class);
        $this->expectExceptionMessage('Callback may only provide 1 argument.');

        $container = new Container();

        $container->create(function (TestService $service, TestModel $model) {
            // do something hiere
        });
    }

    public function test_create_with_resolver()
    {
        $container = new Container();

        $ServiceClass = TestService::class;

        $called = false;
        $s = null;

        $service = $container->create($ServiceClass, function (TestService $service) use (&$called, &$s) {
            $called = true;
            $s = $service;
        });

        $this->assertTrue($called);
        $this->assertSame($service, $s);
    }

    public function test_create_with_callback_and_resolver()
    {
        $container = new Container();

        $called = false;
        $s = null;
        $called2 = false;
        $s2 = null;

        $service = $container->create(
            function (TestService $service) use (&$called, &$s) {
                $called = true;
                $service->name .= '-1';
                $s = $service;
            },
            function (TestService $service) use (&$called2, &$s2) {
                $called2 = true;
                $service->name .= '-2';
                $s2 = $service;
            }
        );

        $this->assertSame('TestService-1-2', $service->name);

        $this->assertTrue($called);
        $this->assertSame($service, $s);

        $this->assertTrue($called2);
        $this->assertSame($service, $s2);
    }

}
