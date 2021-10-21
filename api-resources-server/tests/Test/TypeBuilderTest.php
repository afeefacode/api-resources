<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Test\TypeBuilder;
use PHPUnit\Framework\TestCase;

class TypeBuilderTest extends TestCase
{
    public function test_creates_different_types()
    {
        $type = (new TypeBuilder())->type('Type1')->get();
        $type2 = (new TypeBuilder())->type('Type2')->get();

        $this->assertEquals('Type1', $type::$type);
        $this->assertEquals('Type2', $type2::$type);
    }
}
