<?php

namespace Afeefa\ApiResources\Tests\ActionTest;

use Afeefa\ApiResources\Action\Action;
use Afeefa\ApiResources\Action\ActionInput;
use Afeefa\ApiResources\Action\ActionParams;
use Afeefa\ApiResources\Action\ActionResponse;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Exception\Exceptions\NotACallbackException;
use Afeefa\ApiResources\Exception\Exceptions\NotATypeException;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Test\ActionBuilder;
use function Afeefa\ApiResources\Test\T;
use Afeefa\ApiResources\Test\TypeBuilder;
use Afeefa\ApiResources\Test\TypeRegistry;
use Afeefa\ApiResources\Type\Type;
use Error;

use PHPUnit\Framework\TestCase;

class ActionTest extends TestCase
{
    public function test_missing_name()
    {
        $this->expectException(Error::class);
        $this->expectExceptionMessage('Typed property Afeefa\ApiResources\Action\Action::$name must not be accessed before initialization');

        $action = new Action();

        $this->assertNull($action->getName());
    }

    public function test_name()
    {
        $action = new Action();

        $action->name('hans');
        $this->assertEquals('hans', $action->getName());
    }

    public function test_params()
    {
        $action = (new ActionBuilder())->createInContainer();

        $this->assertFalse($action->hasParam('my_param'));

        $action->params(function (ActionParams $params) {
            $params->attribute('my_param', VarcharAttribute::class);
        });

        $this->assertTrue($action->hasParam('my_param'));
        $this->assertInstanceOf(VarcharAttribute::class, $action->getParam('my_param'));
    }

    public function test_params_get_nonexistent()
    {
        $this->expectException(Error::class);
        $this->expectExceptionMessage('Typed property Afeefa\ApiResources\Action\Action::$params must not be accessed before initialization');

        $action = (new ActionBuilder())->get();
        $action->getParam('my_param');
    }

    public function test_input()
    {
        $type = (new TypeBuilder())->type('Test.Type')->get();
        $action = (new ActionBuilder())->createInContainer();

        $this->assertFalse($action->hasInput());

        $action->input($type::class);

        $this->assertTrue($action->hasInput());
        $this->assertInstanceOf(ActionInput::class, $action->getInput());

        $this->assertEquals(T('Test.Type'), $action->getInput()->getType()::class);
    }

    public function test_response()
    {
        TypeRegistry::reset();

        $type = (new TypeBuilder())->type('Test.Type')->get();
        $action = (new ActionBuilder())->createInContainer();

        $action->response($type::class);

        $this->assertInstanceOf(ActionResponse::class, $action->getResponse());

        $response = $action->getResponse();

        $this->assertEquals(T('Test.Type'), $response->getTypeClass());
        $this->assertEquals([], $response->getTypeClasses());
        $this->assertFalse($response->isList());
    }

    public function test_response_list()
    {
        TypeRegistry::reset();

        $type = (new TypeBuilder())->type('Test.Type')->get();
        $action = (new ActionBuilder())->createInContainer();

        $action->response(Type::list($type::class));

        $this->assertInstanceOf(ActionResponse::class, $action->getResponse());

        $response = $action->getResponse();

        $this->assertEquals(T('Test.Type'), $response->getTypeClass());
        $this->assertEquals([], $response->getTypeClasses());
        $this->assertTrue($response->isList());
    }

    public function test_response_mixed()
    {
        TypeRegistry::reset();

        $action = (new ActionBuilder())->createInContainer();

        $TypeClasses = [
            T('Test.Type'),
            T('Test.Type2'),
            T('Test.Type3'),
        ];

        $action->response($TypeClasses);

        $this->assertInstanceOf(ActionResponse::class, $action->getResponse());

        $response = $action->getResponse();

        $this->assertNull($response->getTypeClass());
        $this->assertEquals($TypeClasses, $response->getTypeClasses());
        $this->assertFalse($response->isList());
    }

    public function test_response_mixed_list()
    {
        TypeRegistry::reset();

        $action = (new ActionBuilder())->createInContainer();

        $TypeClasses = [
            T('Test.Type'),
            T('Test.Type2'),
            T('Test.Type3'),
        ];

        $action->response(Type::list($TypeClasses));

        $this->assertInstanceOf(ActionResponse::class, $action->getResponse());

        $response = $action->getResponse();

        $this->assertNull($response->getTypeClass());
        $this->assertEquals($TypeClasses, $response->getTypeClasses());
        $this->assertTrue($response->isList());
    }

    public function test_response_invalid_type()
    {
        $this->expectException(NotATypeException::class);
        $this->expectExceptionMessage('Value for response $TypeClassOrClasses is not a type.');

        $action = (new ActionBuilder())->createInContainer();
        $action->response('TEST');
    }

    public function test_response_invalid_type_list()
    {
        $this->expectException(NotATypeException::class);
        $this->expectExceptionMessage('Value for response $TypeClassOrClasses is not a type.');

        $action = (new ActionBuilder())->createInContainer();
        $action->response(Type::list('TEST'));
    }

    public function test_response_invalid_type_mixed()
    {
        $this->expectException(NotATypeException::class);
        $this->expectExceptionMessage('Value for response $TypeClassOrClasses is not a list of types.');

        $action = (new ActionBuilder())->createInContainer();
        $action->response(['TEST', 'TEST2']);
    }

    public function test_response_invalid_type_mixed_list()
    {
        $this->expectException(NotATypeException::class);
        $this->expectExceptionMessage('Value for response $TypeClassOrClasses is not a list of types.');

        $action = (new ActionBuilder())->createInContainer();
        $action->response(Type::list(['TEST', 'TEST2']));
    }

    public function test_response_invalid_type_number()
    {
        $this->expectException(NotATypeException::class);
        $this->expectExceptionMessage('Value for response $TypeClassOrClasses is not a type or a list of types.');

        $action = (new ActionBuilder())->createInContainer();
        $action->response(123);
    }

    public function test_missing_response()
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Action test_action does not have a response type.');

        $action = (new ActionBuilder())->action('test_action')->get();

        $this->assertInstanceOf(ActionResponse::class, $action->getResponse());
    }

    public function test_missing_resolver()
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Action my_action does not have a resolver.');

        $action = (new ActionBuilder())->action('my_action')->get();

        $action->getResolve();
    }

    public function test_invalid_resolver()
    {
        $this->expectException(NotACallbackException::class);
        $this->expectExceptionMessage('Resolve callback for action my_action is not callable.');

        $action = (new ActionBuilder())->action('my_action')->get();
        $action->resolve('nix');

        $action->getResolve();
    }

    public function test_missing_resolver_in_schema()
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Action my_action does not have a resolver.');

        $action = (new ActionBuilder())
            ->action('my_action')
            ->withResponse()
            ->createInContainer();

        $action->toSchemaJson();
    }
}
