<?php

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\DB\TypeClassMap;
use Afeefa\ApiResources\DI\Container;
use Backend\Api\BackendApi;
use Backend\Resources\ArticlesResource;
use Backend\Types\ArticleType;
use Backend\Types\AuthorType;
use Backend\Types\CommentType;
use Backend\Types\TagType;
use Medoo\Medoo;
use Slim\Factory\AppFactory;
use Slim\Http\Response;
use Slim\Http\ServerRequest as HttpRequest;

require __DIR__ . '/../vendor/autoload.php';

// error_reporting(E_ALL);

$container = new Container([
    Medoo::class => function () {
        return new Medoo([
            'database_type' => 'mysql',
            'database_name' => 'api',
            'server' => 'mysql',
            'username' => 'root',
            'password' => 'root',
            'logging' => true
        ]);
    },

    TypeClassMap::class => function () {
        return new TypeClassMap([
            'Example.ArticleType' => ArticleType::class,
            'Example.AuthorType' => AuthorType::class,
            'Example.CommentType' => CommentType::class,
            'Example.TagType' => TagType::class
        ]);
    }
]);

AppFactory::setContainer($container);
$app = AppFactory::create();
$app->addErrorMiddleware(true, false, false);

$app->get('/backend-api/test', function (HttpRequest $request, Response $response, array $args) {
    $result = $this->call(function (BackendApi $api) {
        return $api->request(function (ApiRequest $request) {
            $request
                ->resourceName(ArticlesResource::$type)
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

$app->get('/backend-api/tags', function (HttpRequest $request, Response $response, array $args) {
    $result = $this->call(function (BackendApi $api) {
        return $api->request(function (ApiRequest $request) {
            $request
                ->resourceName(ArticlesResource::$type)
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

$app->post('/backend-api', function (HttpRequest $request, Response $response, array $args) {
    $result = $this->call(function (BackendApi $api) {
        return $api->requestFromInput();
    });
    return $response->withJson($result);
});

$app->get('/backend-api/schema', function (HttpRequest $request, Response $response, array $args) {
    $result = $this->call(function (BackendApi $api) {
        return $api->toSchemaJson();
    });
    // $this->dumpEntries();
    return $response->withJson($result);
});

$app->get('/', function (HttpRequest $request, Response $response, array $args) {
    ob_start();
    include 'index.html';
    $content = ob_get_clean();
    $response->getBody()->write($content);
    return $response;
});

$app->run();
