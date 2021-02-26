<?php

use Backend\Seeds\BaseSeeder;

class SeedTags extends BaseSeeder
{
    public function seed()
    {
        $tags = [];

        foreach (range(1, 300) as $number) {
            $name = $this->faker->unique()->word();
            $tags[] = [
                'name' => $name
            ];
        }

        $this->table('tags')->insert($tags)->save();
    }

    public function truncate()
    {
        $this->table('tags')->truncate();
    }
}
