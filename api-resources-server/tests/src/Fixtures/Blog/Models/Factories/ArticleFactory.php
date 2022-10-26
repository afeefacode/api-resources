<?php

namespace Afeefa\ApiResources\Test\Fixtures\Blog\Models\Factories;

use DateTime;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    public function definition()
    {
        return [
            'title' => 'this is a title',
            'date' => new DateTime()
        ];
    }
}
