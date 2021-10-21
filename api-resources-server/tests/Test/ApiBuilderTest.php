<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Test\ApiBuilder;
use PHPUnit\Framework\TestCase;

class ApiBuilderTest extends TestCase
{
    public function test_creates_different_apis()
    {
        $api = (new ApiBuilder())->api('Api1')->get();
        $api2 = (new ApiBuilder())->api('Api2')->get();

        $this->assertEquals('Api1', $api::$type);
        $this->assertEquals('Api2', $api2::$type);
    }
}
