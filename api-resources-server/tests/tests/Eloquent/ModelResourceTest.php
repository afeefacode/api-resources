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
            ->count(2)
            ->has(Article::factory()->count(3))
            ->create();

        $result = (new ApiResources())->requestFromInput(BackendApi::class, [
            'resource' => 'Blog.AuthorResource',
            'action' => 'list',
            'fields' => [
                'name' => true,
                'count_articles' => true
            ]
        ]);

        ['data' => $data] = $result;

        $this->assertCount(2, $data);
        $this->assertEquals(3, $data[0]['count_articles']);
        $this->assertEquals(3, $data[1]['count_articles']);
    }
}
