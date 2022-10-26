<?php

namespace Afeefa\ApiResources\Test\Fixtures\Blog\Models\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AuthorFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => 'i am the one',
            'email' => 'email from author',
            'password' => 'this is my password'
        ];
    }
}
