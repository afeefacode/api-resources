<?php

namespace Afeefa\ApiResources\Tests\Eloquent\Blog;

use Afeefa\ApiResources\ApiResources;
use Afeefa\ApiResources\Test\Eloquent\ApiResourcesEloquentTest;
use Afeefa\ApiResources\Test\Fixtures\Blog\Api\BlogApi;
use Afeefa\ApiResources\Test\Fixtures\Blog\Models\Article;
use Afeefa\ApiResources\Test\Fixtures\Blog\Models\Author;

class EloquentLinkOneRelationTest extends ApiResourcesEloquentTest
{
    public function test_set()
    {
        $article = Article::factory()
            ->forAuthor()
            ->create();

        $author = Author::factory()->create([
            'name' => 'author2'
        ]);

        $this->save(
            id: $article->id,
            data: [
                'author' => [
                    'id' => $author->id
                ]
            ]
        );

        $this->assertAuthor($article->id, ['2', 'author2']);
    }

    protected function save(string $id, array $data = []): array
    {
        return (new ApiResources())->requestFromInput(BlogApi::class, [
            'resource' => 'Blog.ArticleResource',
            'action' => 'save',
            'params' => [
                'id' => $id
            ],
            'data' => $data
        ]);
    }

    protected function get(string $id): array
    {
        return (new ApiResources())->requestFromInput(BlogApi::class, [
            'resource' => 'Blog.ArticleResource',
            'action' => 'get',
            'params' => [
                'id' => $id
            ],
            'fields' => [
                'author' => [
                    'name' => true
                ]
            ]
        ]);
    }

    protected function assertAuthor(?string $id, ?array $author)
    {
        $result = $this->get($id);

        $data = $result['data'];

        if ($author) {
            $this->assertEquals($author[0], $data['author']['id']);
            $this->assertEquals($author[1], $data['author']['name']);
        } else {
            $this->assertNull($id, $data['author']);
        }
    }
}
