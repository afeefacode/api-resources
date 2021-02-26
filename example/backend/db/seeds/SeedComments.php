<?php

use Backend\Seeds\BaseSeeder;

class SeedComments extends BaseSeeder
{
    public function getDependencies()
    {
        return [
            'SeedArticles'
        ];
    }

    public function seed()
    {
        // add comments

        $articles = $this->fetchAll('select * from articles');

        foreach ($articles as $article) {
            $numComments = random_int(0, 10);

            if (!$numComments) {
                echo "no comments for {$article['id']}\n";
                continue;
            }

            $comments = [];

            foreach (range(1, $numComments) as $number) {
                $numParagraphs = random_int(2, 10);
                $content = $this->faker->paragraphs($numParagraphs);

                $comments[] = [
                    'owner_id' => $article['id'],
                    'owner_type' => 'Article',
                    'author_name' => $this->faker->name(),
                    'content' => implode("\n\n", $content)
                ];
            }

            $this->table('comments')->insert($comments)->save();
        }
    }

    public function truncate()
    {
        $this->table('comments')->truncate();
    }
}
