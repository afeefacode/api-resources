<?php

namespace Afeefa\ApiResources\Tests\Validator\Validators;

use Afeefa\ApiResources\DI\Container;
use Afeefa\ApiResources\Validator\Validators\NumberValidator;
use PHPUnit\Framework\TestCase;

class NumberValidatorTest extends TestCase
{
    public function test_default_number()
    {
        /** @var NumberValidator */
        $validator = (new Container())
            ->create(NumberValidator::class);

        foreach ([
            1,
            1.1,
            0,
            -1
        ] as $value) {
            $this->assertTrue($validator->validate($value));
        }

        foreach ([
            'test',
            '1',
            '1.1',
            [],
            $this,
            null
        ] as $value) {
            $this->assertFalse($validator->validate($value));
        }
    }

    public function test_filled()
    {
        /** @var NumberValidator */
        $validator = (new Container())
            ->create(NumberValidator::class)
            ->filled();

        foreach ([
            0,
            1,
            1.1
        ] as $value) {
            $this->assertTrue($validator->validate($value));
        }

        foreach ([
            '0',
            '',
            null
        ] as $value) {
            $this->assertFalse($validator->validate($value));
        }
    }

    public function test_null()
    {
        /** @var NumberValidator */
        $validator = (new Container())
            ->create(NumberValidator::class)
            ->null();

        foreach ([
            1,
            null
        ] as $value) {
            $this->assertTrue($validator->validate($value));
        }
    }

    public function test_min()
    {
        /** @var StringValidator */
        $validator = (new Container())
            ->create(NumberValidator::class)
            ->min(5);

        foreach ([
            5.0000,
            5,
            6
        ] as $value) {
            $this->assertTrue($validator->validate($value));
        }

        foreach ([
            4,
            4.9999,
            0,
            -1
        ] as $value) {
            $this->assertFalse($validator->validate($value));
        }
    }

    public function test_max()
    {
        /** @var NumberValidator */
        $validator = (new Container())
            ->create(NumberValidator::class)
            ->max(5);

        foreach ([
            -4,
            0,
            5
        ] as $value) {
            $this->assertTrue($validator->validate($value));
        }

        foreach ([
            5.00001,
            6,
            100
        ] as $value) {
            $this->assertFalse($validator->validate($value));
        }
    }
}
