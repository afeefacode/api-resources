<?php

namespace Afeefa\ApiResources\Tests\Type;

use Afeefa\ApiResources\Test\ApiResourcesTest;

use function Afeefa\ApiResources\Test\T;

class TypeTest extends ApiResourcesTest
{
    public function test_type()
    {
        $type = $this->typeBuilder()->type('MyType')->get();

        $this->assertEquals('MyType', $type::type());

        $type->getFields();

        T('MyType');
    }
}
