<?php

use Backend\Seeds\BaseSeeder;

class SeedAuthors extends BaseSeeder
{
    public function getDependencies()
    {
        return [
            'SeedTags'
        ];
    }

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

        // add tags

        $authors = $this->fetchAll('select * from authors');

        foreach ($authors as $author) {
            $numTags = random_int(0, 2);
            if (!$numTags) {
                continue;
            }
            $tags = $this->fetchAll('select * from tags order by RAND() limit ' . $numTags);
            $tags = array_map(function ($tag) use ($author) {
                return '(' . implode(', ', [$tag['id'], $author['id'], "'Example.Author'"]) . ')';
            }, $tags);
            $tags = implode(', ', $tags);

            $this->execute(
                'insert into tag_users (tag_id, user_id, user_type)
                values ' . $tags
            );
        }
    }

    public function truncate()
    {
        $this->table('authors')->truncate();
        $this->execute("delete from tag_users where user_type = 'Author'");
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
