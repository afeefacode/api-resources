<?php

namespace Afeefa\ApiResources\Test\Eloquent;

use Afeefa\ApiResources\Eloquent\Model;
use Afeefa\ApiResources\Test\ApiResourcesTest;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Events\Dispatcher;
use PDO;

class ApiResourcesEloquentTest extends ApiResourcesTest
{
    private static ?PDO $pdo = null;

    private static array $usedTables = [];

    public static function setUpBeforeClass(): void
    {
        static::connectDb();
    }

    protected function setUp(): void
    {
        parent::setUp();

        // remove tables used in last test
        // before the next one to allow for
        // exploring database after test
        $tables = array_keys(static::$usedTables);
        if (count($tables)) {
            $pdo = static::$pdo;
            $pdo->exec('SET foreign_key_checks = 0');
            foreach (array_keys(static::$usedTables) as $table) {
                $pdo->exec("truncate table {$table}");
            }
            $pdo->exec('SET foreign_key_checks = 1');
        }
    }

    protected function modelTypeBuilder(): ModelTypeBuilder
    {
        return (new ModelTypeBuilder($this->container));
    }

    protected static function connectDb()
    {
        if (!self::$pdo) {
            $capsule = new DB();
            $capsule->setEventDispatcher(new Dispatcher());
            $capsule->setAsGlobal();
            $capsule->bootEloquent();

            $dbConfig = (include('phinx.php'))['environments']['development'];

            $capsule->addConnection([
                'driver' => 'mysql',
                'host' => $dbConfig['host'],
                'port' => $dbConfig['port'],
                'database' => $dbConfig['name'],
                'username' => $dbConfig['user'],
                'password' => $dbConfig['pass']
            ]);

            self::$pdo = $capsule->getConnection()->getPdo();

            // Model factories have to live here Models/Factories

            Factory::guessFactoryNamesUsing(function (string $ModelClass) {
                return preg_replace('/Models/', 'Models\Factories', $ModelClass) . 'Factory';
            });

            Factory::guessModelNamesUsing(function (Factory $factory) {
                return preg_replace('/Factories\\\(.+)Factory/', '$1', $factory::class);
            });

            // track all tables changed

            $dispatcher = $capsule->getEventDispatcher();
            $dispatcher->listen('eloquent.created: *', function (string $event, array $models) {
                foreach ($models as $model) {
                    static::$usedTables[$model->getTable()] = true;
                }
            });
        }
    }
}
