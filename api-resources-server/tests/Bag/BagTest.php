<?php

namespace Afeefa\ApiResources\Tests\DI;

use Afeefa\ApiResources\Bag\Bag;
use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\Bag\NotABagEntryException;
use PHPUnit\Framework\TestCase;

class BagTest extends TestCase
{
    public function test_bag()
    {
        $bag = new Bag();

        $this->assertFalse($bag->has('one'));

        $entry = $this->createEntry([
            'value' => 'one'
        ]);

        $bag->set('one', $entry);

        $this->assertTrue($bag->has('one'));
        $this->assertFalse($bag->has('two'));

        $this->assertSame($bag->get('one'), $entry);

        $expected = [
            'one' => [
                'value' => 'one'
            ]
        ];
        $this->assertEquals($expected, $bag->toSchemaJson());
    }

    public function test_get_nonexisting()
    {
        $this->expectException(NotABagEntryException::class);
        $this->expectExceptionMessage('one is not a known Bag entry.');

        $bag = new Bag();

        $bag->get('one');
    }

    public function test_remove()
    {
        $bag = new Bag();

        $this->assertFalse($bag->has('one'));
        $this->assertFalse($bag->has('two'));

        $entry = $this->createEntry([
            'value' => 'one'
        ]);

        $entry2 = $this->createEntry([
            'value' => 'one2'
        ]);

        $bag->set('one', $entry);
        $bag->set('two', $entry2);

        $this->assertTrue($bag->has('one'));
        $this->assertTrue($bag->has('two'));

        $bag->remove('one');

        $this->assertFalse($bag->has('one'));
    }

    public function test_remove_nonexisting()
    {
        $this->expectException(NotABagEntryException::class);
        $this->expectExceptionMessage('one is not a known Bag entry.');

        $bag = new Bag();

        $bag->remove('one');
    }

    public function test_set_non_bagentry()
    {
        $message = preg_quote('Argument 2 passed to Afeefa\ApiResources\Bag\Bag::set() must implement interface Afeefa\ApiResources\Bag\BagEntryInterface, string given');
        $this->expectExceptionMessageMatches("/{$message}/");

        $bag = new Bag();

        $test = 'hoho';
        $a = 'test';

        $bag->set('one', $$a);
    }

    private function createEntry($toJson): BagEntry
    {
        return new class($toJson) extends BagEntry {
            public function __construct($toJson)
            {
                $this->toJson = $toJson;
            }

            public function toSchemaJson(): array
            {
                return $this->toJson;
            }
        };
    }
}
