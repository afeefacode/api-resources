<?php

namespace Afeefa\ApiResources\Tests\Eloquent;

use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\StringAttribute;
use Afeefa\ApiResources\Test\Eloquent\ApiResourcesEloquentTest;

class ModelTypeTest extends ApiResourcesEloquentTest
{
    public function test_model_type()
    {
        $type = $this->modelTypeBuilder()->modelType(
            'Test.Type',
            Model::class,
            function (FieldBag $fields) {
                $fields->attribute('name', StringAttribute::class);
            }
        )->get();

        $this->assertEquals(Model::class, $type::$ModelClass);
        $this->assertEquals('Test.Type', $type::type());
    }

    public function test_model_type_missing_model_class()
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessageMatches('/^Missing Eloquent model in class Afeefa\\\ApiResources\\\Test\\\Eloquent\\\TestModelType@anonymous/');

        $this->modelTypeBuilder()->type(
            'Test.Type'
        )->get();
    }
}
