<?php

namespace Afeefa\ApiResources\Tests\Filter;

use Afeefa\ApiResources\Test\FilterBuilder;
use Error;
use PHPUnit\Framework\TestCase;

class FilterTest extends TestCase
{
    public function test_options()
    {
        $filter = (new FilterBuilder())->filter('Test.Filter')->get();

        $this->assertFalse($filter->hasOption('my_option'));
        $this->assertEquals([], $filter->getOptions());

        $filter->options(['one', 'two']);
        $this->assertTrue($filter->hasOption('one'));
        $this->assertEquals(['one', 'two'], $filter->getOptions());

        $filter->options(['my_option', 'your_option']);
        $this->assertTrue($filter->hasOption('my_option'));
        $this->assertEquals(['my_option', 'your_option'], $filter->getOptions());

        $filter->options([]);
        $this->assertFalse($filter->hasOption('my_option'));
        $this->assertEquals([], $filter->getOptions());
    }

    public function test_default()
    {
        $filter = (new FilterBuilder())->filter('Test.Filter')->get();

        $this->assertFalse($filter->hasDefaultValue());
        $this->assertNull($filter->getDefaultValue());

        $filter->default(null);
        $this->assertTrue($filter->hasDefaultValue());
        $this->assertNull($filter->getDefaultValue());

        $filter->default('my_default');
        $this->assertTrue($filter->hasDefaultValue());
        $this->assertEquals('my_default', $filter->getDefaultValue());
    }

    public function test_allow_null()
    {
        $filter = (new FilterBuilder())->filter('Test.Filter')->get();

        $this->assertFalse($filter->nullIsAllowed());

        $filter->allowNull();
        $this->assertTrue($filter->nullIsAllowed());

        $filter->allowNull(false);
        $this->assertFalse($filter->nullIsAllowed());

        $filter->allowNull(true);
        $this->assertTrue($filter->nullIsAllowed());
    }

    public function test_options_with_null_auto_allows_null()
    {
        $filter = (new FilterBuilder())->filter('Test.Filter')->get();

        $this->assertFalse($filter->nullIsAllowed());

        $filter->options([null]);
        $this->assertTrue($filter->nullIsAllowed());

        $filter->options(['test']);
        $this->assertFalse($filter->nullIsAllowed());
    }

    public function test_missing_name()
    {
        $this->expectException(Error::class);
        $this->expectExceptionMessage('Typed property Afeefa\ApiResources\Filter\Filter::$name must not be accessed before initialization');

        $filter = (new FilterBuilder())->filter('Test.Filter')->get();

        $this->assertNull($filter->getName());
    }

    public function test_name()
    {
        $filter = (new FilterBuilder())->filter('Test.Filter')->get();

        $filter->name('hans');
        $this->assertEquals('hans', $filter->getName());
    }

    public function test_setup()
    {
        $filter = (new FilterBuilder())->filter(
            'Test.Filter',
            function () {
                /** @var Filter */
                $filter = $this;
                $filter
                    ->name('hans')
                    ->options(['test'])
                    ->default('my_default');
            }
        )->createInContainer();

        $this->assertEquals('hans', $filter->getName());
        $this->assertEquals(['test'], $filter->getOptions());
        $this->assertEquals('my_default', $filter->getDefaultValue());
    }
}