<?php

namespace Backend\Seeds;

use Faker\Generator;
use Phinx\Seed\AbstractSeed;

class BaseSeeder extends AbstractSeed
{
    /**
     * @var Generator
     */
    protected $faker;

    public function __construct()
    {
        $this->faker = FakerFactory::get();
    }

    public function run()
    {
        $this->execute('SET FOREIGN_KEY_CHECKS=0');
        $this->truncate();
        $this->execute('SET FOREIGN_KEY_CHECKS=1');

        $this->seed();
    }

    public function truncate()
    {
    }

    public function seed()
    {
    }
}
