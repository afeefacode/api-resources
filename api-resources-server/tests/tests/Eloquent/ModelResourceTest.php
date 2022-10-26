<?php

namespace Afeefa\ApiResources\Tests\Eloquent;

use Afeefa\ApiResources\ApiResources;
use Afeefa\ApiResources\Test\Eloquent\ApiResourcesEloquentTest;
use Afeefa\ApiResources\Test\Fixtures\Blog\Api\BackendApi;
use Afeefa\ApiResources\Test\Fixtures\Blog\Models\Article;
use Afeefa\ApiResources\Test\Fixtures\Blog\Models\Author;

class ModelResourceTest extends ApiResourcesEloquentTest
{
    public function test_model_resource()
    {
        Author::factory()
            ->count(5)
            ->has(Article::factory()->count(5))
            ->create();

        $result = (new ApiResources())->requestFromInput(BackendApi::class, [
            'resource' => 'Blog.AuthorResource',
            'action' => 'list',
            'fields' => [
                'name' => true,
                'articles' => true,
                'count_articles' => true
            ]
        ]);

        $this->assertEquals(5, count($result['data']));

        // $models = array_map(fn ($m) => $m->toArray(), $result['data']);
        // debug_dump($models);
    }
}
