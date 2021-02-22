<?php

use Faker\Factory;
use Phinx\Seed\AbstractSeed;

class SeedTags extends AbstractSeed
{
    public function run()
    {
        $this->truncate();

        $faker = Factory::create('de_DE');

        $tags = [];

        foreach (range(1, 100) as $id) {
            $name = $faker->unique()->word();

            echo "$name\n";

            $tags[] = [
                'name' => $name
            ];
        }

        $this->table('tags')->insert($tags)->save();
    }

    public function truncate()
    {
        $this->execute('SET FOREIGN_KEY_CHECKS=0');

        $this->table('tags')->truncate();

        $this->execute('SET FOREIGN_KEY_CHECKS=1');
    }
}
