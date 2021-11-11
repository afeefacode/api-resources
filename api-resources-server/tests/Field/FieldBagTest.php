<?php

namespace Afeefa\ApiResources\Tests\Field;

use Afeefa\ApiResources\Exception\Exceptions\NotATypeOrCallbackException;
use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Field\Fields\HasOneRelation;
use Afeefa\ApiResources\Field\Fields\VarcharAttribute;
use Afeefa\ApiResources\Test\ApiResourcesTest;
use function Afeefa\ApiResources\Test\T;

use Error;

class FieldBagTest extends ApiResourcesTest
{
    public function test_bag()
    {
        $fields = $this->container->create(FieldBag::class);

        $this->assertEquals(0, $fields->numEntries());

        $fields->attribute('name', VarcharAttribute::class);

        $this->assertEquals(1, $fields->numEntries());
    }

    public function test_wrong_attribute_type()
    {
        $this->expectException(NotATypeOrCallbackException::class);
        $this->expectExceptionMessage('Argument is not a known type: Hoho');

        $fields = $this->container->create(FieldBag::class);
        $fields->attribute('name', 'Hoho');
    }

    public function test_wrong_relation_related_type()
    {
        $this->expectException(Error::class);
        $this->expectExceptionMessage('Class "Hoho" not found');

        $fields = $this->container->create(FieldBag::class);
        $fields->relation('name', 'Hoho', HasOneRelation::class);
    }

    public function test_wrong_relation_type()
    {
        $this->expectException(NotATypeOrCallbackException::class);
        $this->expectExceptionMessage('Argument is not a known type: RelationClass');

        $fields = $this->container->create(FieldBag::class);
        $fields->relation('name', T('Test.Type'), 'RelationClass');
    }
}
