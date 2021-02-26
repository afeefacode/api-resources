<?php

use Backend\Seeds\BaseSeeder;

class SeedAuthors extends BaseSeeder
{
    public function seed()
    {
        $authors = [];

        foreach (range(1, 10) as $number) {
            $name = $this->faker->firstName() . ' ' . $this->faker->lastName;

            $authors[] = [
                'name' => $name,
                'email' => $this->slugifyName($name) . '@posteo.de',
                'password' => $this->slugifyName($name)
            ];
        }

        $this->table('authors')->insert($authors)->save();
    }

    public function truncate()
    {
        $this->table('authors')->truncate();
    }

    protected function slugifyName($name)
    {
        setlocale(LC_ALL, 'de_DE.UTF-8');
        // replace spaces with .
        $email = preg_replace('~ +~', '.', $name);
        // transliterate
        $email = iconv('utf-8', 'ascii//TRANSLIT', $email);
        // lowercase
        return strtolower($email);
    }
}
