<?php

namespace Afeefa\ApiResources\Tests\Eloquent\Blog;

use Afeefa\ApiResources\ApiResources;
use Afeefa\ApiResources\Test\Eloquent\ApiResourcesEloquentTest;
use Afeefa\ApiResources\Test\Fixtures\Blog\Api\BlogApi;
use Afeefa\ApiResources\Test\Fixtures\Blog\Models\Author;
use Afeefa\ApiResources\Test\Fixtures\Blog\Models\Link;

class EloquentHasManyRelationTest extends ApiResourcesEloquentTest
{
    public function test_set_one()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links' => [
                    ['url' => 'link3']
                ]
            ]
        );

        $this->assertLinks($author->id, ['3' => 'link3']);
    }

    public function test_set_one_update()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links' => [
                    ['id' => '1', 'url' => 'link1_update']
                ]
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1_update']);
    }

    public function test_set_one_update_not_exists()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links' => [
                    ['id' => 'does_not_exist', 'url' => 'link3']
                ]
            ]
        );

        $this->assertLinks($author->id, ['3' => 'link3']);
    }

    public function test_set_many()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links' => [
                    ['url' => 'link3'],
                    ['url' => 'link4']
                ]
            ]
        );

        $this->assertLinks($author->id, ['3' => 'link3', '4' => 'link4']);
    }

    public function test_set_many_update()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links' => [
                    ['id' => '1', 'url' => 'link1_update'],
                    ['url' => 'link3'],
                    ['id' => 'does_not_exist', 'url' => 'link4'],
                ]
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1_update', '3' => 'link3', '4' => 'link4']);
    }

    public function test_set_empty()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links' => []
            ]
        );

        $this->assertLinks($author->id, []);
    }

    public function test_add_one()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links#add' => [
                    ['url' => 'link3']
                ]
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1', '2' => 'link2', '3' => 'link3']);
    }

    public function test_add_one_update()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links#add' => [
                    ['id' => '1', 'url' => 'link1_update']
                ]
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1_update', '2' => 'link2']);
    }

    public function test_add_one_update_not_exists()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links#add' => [
                    ['id' => 'does_not_exist', 'url' => 'link3']
                ]
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1', '2' => 'link2', '3' => 'link3']);
    }

    public function test_add_empty()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links#add' => []
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1', '2' => 'link2']);
    }

    public function test_add_many()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links#add' => [
                    ['url' => 'link3'],
                    ['url' => 'link4']
                ]
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1', '2' => 'link2', '3' => 'link3', '4' => 'link4']);
    }

    public function test_add_many_update()
    {
        $author = $this->createAuthorWithLinks(2);

        $this->save(
            id: $author->id,
            data: [
                'links#add' => [
                    ['id' => '1', 'url' => 'link1_update'],
                    ['url' => 'link3'],
                    ['id' => 'does_not_exist', 'url' => 'link4'],
                ]
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1_update', '2' => 'link2', '3' => 'link3', '4' => 'link4']);
    }

    public function test_delete_one()
    {
        $author = $this->createAuthorWithLinks(3);

        $this->save(
            id: $author->id,
            data: [
                'links#delete' => [
                    ['id' => '2']
                ]
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1', '3' => 'link3']);
    }

    public function test_delete_one_not_exists()
    {
        $author = $this->createAuthorWithLinks(3);

        $this->save(
            id: $author->id,
            data: [
                'links#delete' => [
                    ['id' => 'does_not_exist']
                ]
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1', '2' => 'link2', '3' => 'link3']);
    }

    public function test_delete_many()
    {
        $author = $this->createAuthorWithLinks(5);

        $this->save(
            id: $author->id,
            data: [
                'links#delete' => [
                    ['id' => '2'],
                    ['id' => '3'],
                    ['id' => 'does_not_exist']
                ]
            ]
        );

        $this->assertLinks($author->id, ['1' => 'link1', '4' => 'link4', '5' => 'link5']);
    }

    protected function createAuthorWithLinks($numLinks): Author
    {
        $author = Author::factory()
            ->has(Link::factory($numLinks)->sequence(fn ($s) => ['url' => 'link' . $s->index + 1]))
            ->create();

        $expectedLinks = array_reduce(range(1, $numLinks), function ($links, $index) {
            $links["{$index}"] = 'link' . $index;
            return $links;
        }, []);

        $this->assertLinks($author->id, $expectedLinks);

        return $author;
    }

    protected function save(string $id, array $data = []): array
    {
        return (new ApiResources())->requestFromInput(BlogApi::class, [
            'resource' => 'Blog.AuthorResource',
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
            'resource' => 'Blog.AuthorResource',
            'action' => 'get',
            'params' => [
                'id' => $id
            ],
            'fields' => [
                'count_links' => true,
                'links' => [
                    'url' => true
                ]
            ]
        ]);
    }

    protected function assertLinks(string $id, array $names)
    {
        $result = $this->get($id);

        $data = $result['data'];
        $this->assertCount(count($names), $data['links']);
        $this->assertEquals(count($names), $data['count_links']);

        $index = 0;
        foreach ($names as $id => $name) {
            $this->assertEquals($id, $data['links'][$index]['id']);
            $this->assertEquals($name, $data['links'][$index]['url']);
            $index++;
        }
    }
}
