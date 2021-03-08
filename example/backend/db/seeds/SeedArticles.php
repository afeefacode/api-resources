<?php

use Backend\Seeds\BaseSeeder;

class SeedArticles extends BaseSeeder
{
    public function getDependencies()
    {
        return [
            'SeedAuthors',
            'SeedTags'
        ];
    }

    public function seed()
    {
        // add articles

        $articles = [];

        foreach (range(1, 300) as $number) {
            $author = $this->fetchRow('select * from authors order by RAND() limit 1');

            $numParagraphs = random_int(2, 10);
            $content = $this->faker->paragraphs($numParagraphs);

            $articles[] = [
                'author_id' => $author['id'],
                'title' => $this->faker->sentence(),
                'summary' => $content[0],
                'content' => implode("\n\n", $content),
                'date' => $this->faker->dateTimeBetween('-5 years')->format('Y-m-d H:i:s')
            ];
        }

        $this->table('articles')->insert($articles)->save();

        $articles = $this->fetchAll('select * from articles');

        // add tags

        foreach ($articles as $article) {
            $tags = $this->fetchAll('select * from tags order by RAND() limit 3');
            $tags = array_map(function ($tag) use ($article) {
                return '(' . implode(', ', [$tag['id'], $article['id'], "'Article'"]) . ')';
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
        $this->table('articles')->truncate();
    }
}
