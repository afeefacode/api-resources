<?php

namespace Afeefa\ApiResources\Tests\Api;

use Afeefa\ApiResources\Test\ResourceBuilder;
use PHPUnit\Framework\TestCase;

class ResourceBuilderTest extends TestCase
{
    public function test_creates_different_resources()
    {
        $resource = (new ResourceBuilder())->resource('Resource1')->get();
        $resource2 = (new ResourceBuilder())->resource('Resource2')->get();

        $this->assertEquals('Resource1', $resource::$type);
        $this->assertEquals('Resource2', $resource2::$type);
    }
}
