<?php

use Medoo\Medoo;
use Slim\Factory\AppFactory;
use Slim\Http\Response;
use Slim\Http\ServerRequest as Request;

require __DIR__ . '/../vendor/autoload.php';

$db = new Medoo([
    'database_type' => 'mysql',
    'database_name' => 'api',
    'server' => 'mysql',
    'username' => 'root',
    'password' => 'root'
]);

$app = AppFactory::create();

$app->get('/api', function (Request $request, Response $response, array $args) use ($db) {
    $tags = $db->select('tags', ['id', 'name']);
    return $response->withJson($tags);
});

$app->get('/', function (Request $request, Response $response, array $args) use ($db) {
    $response->getBody()->write('Hello Api Resources <a href="/frontend">Frontend</a>');
    return $response;
});

$app->run();
