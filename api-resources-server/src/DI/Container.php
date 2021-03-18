<?php

namespace Afeefa\ApiResources\DI;

use Afeefa\ApiResources\Exception\Exceptions\MissingTypeHintException;
use Closure;
use Psr\Container\ContainerInterface;
use ReflectionFunction;
use ReflectionNamedType;

class Container implements ContainerInterface
{
    private array $entries = [];

    private array $config = [];

    public function __construct(array $config = [])
    {
        $this->config = $config;
    }

    /**
     * Creates and adds a container entry, if it not exists
     */
    public function add(string $Class): void
    {
        $this->get($Class);
    }

    /**
     * Returns a container entry and creates and adds it, if it not exists
     */
    public function get(string $Class, Closure $callback = null): object
    {
        if (!$this->has($Class)) {
            $this->create($Class, function (Injector $i) {
                $i->register = true;
            });
        }

        $instance = $this->entries[$Class];

        if ($callback) {
            $callback($instance);
        }

        return $instance;
    }

    public function has(string $Class): bool
    {
        return isset($this->entries[$Class]);
    }

    /**
     * Creates a class but does not add it to the container
     */
    public function create(string $Class, Closure $injectorCallback = null, Closure $callback = null): object
    {
        $injector = new Injector();
        if ($injectorCallback) {
            $injectorCallback($injector, $Class);
        }

        $construct = $this->config[$Class] ?? null;

        if ($injector->register) {
            $instance = $construct ? $construct() : new $Class();
            $this->register($Class, $instance);
            $this->bootstrapInstance($instance);
        }

        $instance = $construct ? $construct() : new $Class();
        $this->bootstrapInstance($instance);

        if ($callback) {
            $callback($instance);
        }
        return $instance;
    }

    /**
     * Calls a function while injecting dependencies
     */
    public function call(Closure $callback, Closure $injectorCallback = null, Closure $typesCallback = null)
    {
        $argumentTypes = $this->getCallbackArgumentTypes($callback);

        $arguments = array_map(function ($Type, $index) use ($injectorCallback) {
            $injector = new Injector();
            if ($injectorCallback) {
                $injectorCallback($injector, $Type, $index);
            }

            if ($injector->instance) {
                return $injector->instance;
            } elseif ($injector->create) {
                return $this->create($Type, $injectorCallback);
            }
            return $this->get($Type);
        }, $argumentTypes, array_keys($argumentTypes));

        if ($typesCallback) {
            $typesCallback(...$arguments);
        }

        return $callback(...$arguments);
    }

    /**
     * Returns all container entries
     */
    public function entries(): array
    {
        return $this->entries;
    }

    public function dumpEntries()
    {
        $dump = array_map(function ($key, $entry) {
            return $key;
        }, array_keys($this->entries), $this->entries);

        sort($dump);

        debug_dump($dump);
    }

    private function register(string $Class, object $instance)
    {
        if (!isset($this->entries[$Class])) {
            $this->entries[$Class] = $instance;
        }
    }

    private function bootstrapInstance($instance): void
    {
        if ($instance instanceof ContainerAwareInterface) {
            $instance->container($this);
            $instance->created();
        }
    }

    private function getCallbackArgumentTypes(Closure $callback): array
    {
        $argumentTypes = [];

        $f = new ReflectionFunction($callback);
        $params = $f->getParameters();
        foreach ($params as $param) {
            $type = $param->getType();
            if ($type instanceof ReflectionNamedType) {
                $argumentTypes[] = $type->getName();
                continue;
            }
            throw new MissingTypeHintException("Callback variable \${$param->getName()} does provide a type hint.");
        }

        return $argumentTypes;
    }
}
