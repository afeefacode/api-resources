<?php

use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\DI\Container;
use Backend\Api\BackendApi;
use Backend\Resources\ArticlesResource;
use Medoo\Medoo;
use Slim\Factory\AppFactory;
use Slim\Http\Response;
use Slim\Http\ServerRequest as HttpRequest;

require __DIR__ . '/../vendor/autoload.php';

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
    }
]);

AppFactory::setContainer($container);
$app = AppFactory::create();
$app->addErrorMiddleware(true, false, false);

$app->get('/backend-api/test', function (HttpRequest $request, Response $response, array $args) {
    $result = $this->call(function (BackendApi $api) {
        return $api->request(function (ApiRequest $request) {
            $request
                ->resource(ArticlesResource::$type)
                ->action('get_articles')
                ->fields([
                    'title' => true,
                    'author' => [
                        'name' => true,
                        'email' => true
                    ]
                ]);
        });
    });
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
