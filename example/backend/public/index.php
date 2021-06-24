<?php

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\DB\TypeClassMap;
use Afeefa\ApiResources\DI\Container;
use Backend\Api\BackendApi;
use Backend\Resources\ArticlesResource;
use Backend\Resources\AuthorsResource;
use Medoo\Medoo;
use Slim\Factory\AppFactory;
use Slim\Http\Response;
use Slim\Http\ServerRequest;

require __DIR__ . '/../vendor/autoload.php';

error_reporting(E_ALL);

class MedooWithSql extends Medoo
{
    public function sql($table, $join, $columns = null, $where = null)
    {
        $map = [];
        $query = $this->selectContext($table, $map, $join, $columns, $where);
        return $this->generate($query, $map);
    }

    protected function whereClause($where, &$map)
    {
        if (isset($where['HAVING']) && !isset($where['GROUP'])) {
            $where['GROUP'] = 'id';
        }

        return parent::whereClause($where, $map);
    }

    protected function dataImplode($data, &$map, $conjunctor)
    {
        $where = parent::dataImplode($data, $map, $conjunctor);

        $where = preg_replace('/"EXISTS" =/', 'EXISTS', $where);

        return $where;
    }
}

$container = new Container([
    Medoo::class => function () {
        return new MedooWithSql([
            'database_type' => 'mysql',
            'database_name' => 'api',
            'server' => 'mysql',
            'username' => 'root',
            'password' => 'root',
            'logging' => true
        ]);
    }
]);

AppFactory::setContainer($container);
$app = AppFactory::create();
$app->addErrorMiddleware(true, false, false);

$app->get('/backend-api/test', function (ServerRequest $request, Response $response, array $args) {
    $result = $this->call(function (BackendApi $api) {
        return $api->request(function (ApiRequest $request) {
            $request
                ->resourceType(ArticlesResource::$type)
                ->actionName('get_articles')
                ->fields([
                    'title' => true,
                    'date' => true,
                    'summary' => true,
                    'author' => [
                        'name' => true,
                        'email' => true,
                        'tags' => [
                            'name' => true
                        ],
                        'articles' => [
                            'title' => true,
                            'author' => [
                                'name' => true,
                                'email' => true,
                            ],
                            'tags' => [
                                'name' => true
                            ]
                        ]
                    ],
                    'tags' => [
                        'name' => true
                    ],
                    'comments' => [
                        'author_name' => true,
                        'date' => true
                    ],
                    'author2' => [
                        'name' => true
                    ]
                ]);
        });
    });

    // debug_dump($this->get(Medoo::class)->log());
    // exit;

    return $response->withJson($result);
});

$app->get('/backend-api/tags', function (ServerRequest $request, Response $response, array $args) {
    $result = $this->call(function (BackendApi $api) {
        return $api->request(function (ApiRequest $request) {
            $request
                ->resourceType(ArticlesResource::$type)
                ->actionName('get_articles')
                ->fields([
                    'title' => true,
                    'tags' => [
                        'name' => true,
                        'users' => [
                            '@Example.ArticleType' => [
                                'title' => true
                            ],
                            '@Example.AuthorType' => [
                                'name' => true
                            ]
                        ]
                    ],
                ]);
        });
    });

    // debug_dump($this->get(Medoo::class)->log());
    // exit;

    return $response->withJson($result);
});

$app->get('/backend-api/author', function (ServerRequest $request, Response $response, array $args) {
    $result = $this->call(function (BackendApi $api, TypeClassMap $typeClassMap) {
        $result = $api->request(function (ApiRequest $request) {
            $request
                ->resourceType(AuthorsResource::$type)
                ->actionName('get_author')
                ->params([
                    'id' => 6
                ])
                ->fields([
                    'name' => true,
                    'tags' => true
                ]);
        });

        // debug_dump($typeClassMap);
        return $result;
    });

    // debug_dump($this->get(Medoo::class)->log());
    // exit;

    return $response->withJson($result);
});

$app->post('/backend-api', function (ServerRequest $request, Response $response, array $args) {
    $result = $this->call(function (BackendApi $api, TypeClassMap $typeClassMap) {
        $result = $api->requestFromInput();
        // debug_dump($typeClassMap);
        return $result;
    });
    $result['db'] = $this->get(Medoo::class)->log();
    return $response->withJson($result);
});

$app->get('/backend-api/schema', function (ServerRequest $request, Response $response, array $args) {
    $result = $this->call(function (BackendApi $api, TypeClassMap $typeClassMap) {
        $result = $api->toSchemaJson();
        // debug_dump($typeClassMap);
        return $result;
    });
    // $this->dumpEntries();
    return $response->withJson($result);
});

$app->get('/', function (ServerRequest $request, Response $response, array $args) {
    ob_start();
    include 'index.html';
    $content = ob_get_clean();
    $response->getBody()->write($content);
    return $response;
});

$app->run();
