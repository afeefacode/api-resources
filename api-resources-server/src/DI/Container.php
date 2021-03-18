<?php

namespace Afeefa\ApiResources\DI;

use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackArgumentException;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeHintException;
use Closure;
use ReflectionFunction;
use ReflectionNamedType;

class Container
{
    private array $entries = [];
    private array $config = [];

    public static function withConfig(array $config): Container
    {
        $container = new Container();
        $container->config($config);
        return $container;
    }

    public function config(array $config): void
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
    public function get(string $Class): object
    {
        if (!isset($this->entries[$Class])) {
            $args = $this->config[$Class] ?? [];
            $instance = new $Class(...$args);
            $this->entries[$Class] = $instance;
            $this->bootstrapInstance($instance);
        }

        return $this->entries[$Class];
    }

    /**
     * Returns all container entries
     */
    public function entries(): array
    {
        return $this->entries;
    }

    /**
     * Creates a class but does not add it to the container
     */
    public function create(string $Class, Closure $callback = null): object
    {
        $instance = new $Class();
        $this->bootstrapInstance($instance);
        if ($callback) {
            $callback($instance);
        }
        return $instance;
    }

    /**
     * Calls a function while injecting dependencies
     */
    public function call(Closure $callback, array $arguments = [])
    {
        if (!count($arguments)) {
            $argumentTypes = $this->getCallbackArgumentTypes($callback);

            $arguments = array_map(function ($argument) {
                return $this->get($argument);
            }, $argumentTypes);
        }

        return $callback(...$arguments);
    }

    /**
     * Returns the type of the first callback argument
     */
    public function getCallbackArgumentType(Closure $callback): string
    {
        $arguments = $this->getCallbackArgumentTypes($callback);

        $type = $arguments[0] ?? null;

        if (!$type) {
            throw new MissingCallbackArgumentException('Callback does not provide an argument.');
        }

        return $type;
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
