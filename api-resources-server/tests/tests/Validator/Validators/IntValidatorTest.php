<?php

namespace Afeefa\ApiResources\Tests\Validator\Validators;

use Afeefa\ApiResources\DI\Container;
use Afeefa\ApiResources\Validator\Validators\IntValidator;
use PHPUnit\Framework\TestCase;

class IntValidatorTest extends TestCase
{
    public function test_default_int()
    {
        /** @var IntValidator */
        $validator = (new Container())
            ->create(IntValidator::class);

        foreach ([
            0,
            1,
            1000,
            null
        ] as $value) {
            $this->assertTrue($validator->validateRule('int', $value));
        }

        foreach ([
            'test',
            '1',
            '1.1',
            '-1',
            -1,
            3.0,
            1.1,
            -1.1,
            [],
            $this,
            ''
        ] as $value) {
            $this->assertFalse($validator->validateRule('int', $value));
        }
    }

    public function test_filled()
    {
        /** @var IntValidator */
        $validator = (new Container())
            ->create(IntValidator::class)
            ->filled();

        foreach ([
            0,
            1
        ] as $value) {
            $this->assertTrue($validator->validateRule('filled', $value));
        }

        foreach ([
            null
        ] as $value) {
            $this->assertFalse($validator->validateRule('filled', $value));
        }
    }

    public function test_null()
    {
        /** @var IntValidator */
        $validator = (new Container())
            ->create(IntValidator::class)
            ->null();

        foreach ([
            1,
            null
        ] as $value) {
            $this->assertTrue($validator->validateRule('null', $value));
        }

        /** @var IntValidator */
        $validator = (new Container())
            ->create(IntValidator::class);

        foreach ([
            null
        ] as $value) {
            $this->assertFalse($validator->validateRule('null', $value));
        }
    }

    public function test_max()
    {
        /** @var IntValidator */
        $validator = (new Container())
            ->create(IntValidator::class)
            ->max(5);

        foreach ([
            4,
            5
        ] as $value) {
            $this->assertTrue($validator->validateRule('max', $value));
        }

        foreach ([
            6
        ] as $value) {
            $this->assertFalse($validator->validateRule('max', $value));
        }
    }

    public function test_min()
    {
        /** @var StringValidator */
        $validator = (new Container())
            ->create(IntValidator::class)
            ->min(5);

        foreach ([
            5,
            6
        ] as $value) {
            $this->assertTrue($validator->validateRule('min', $value));
        }

        foreach ([
            4
        ] as $value) {
            $this->assertFalse($validator->validateRule('min', $value));
        }
    }
}
