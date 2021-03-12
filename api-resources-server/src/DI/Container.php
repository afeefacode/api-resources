<?php

namespace Afeefa\ApiResources\DI;

use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackArgumentException;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeHintException;
use ReflectionFunction;
use ReflectionNamedType;

class Container
{
    private array $entries = [];

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
            $instance = new $Class();
            $this->entries[$Class] = $instance;
            $this->bootstrap($instance);
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
    public function create(string $Class, callable $callback = null): object
    {
        $instance = new $Class();
        $this->bootstrap($instance);
        if ($callback) {
            $callback($instance);
        }
        return $instance;
    }

    /**
     * Returns the type of the first callback argument
     */
    public function getCallbackArgumentType(callable $callback): string
    {
        $f = new ReflectionFunction($callback);
        $param = $f->getParameters()[0] ?? null;
        if ($param) {
            $type = $param->getType();
            if ($type instanceof ReflectionNamedType) {
                return $type->getName();
            }
            throw new MissingTypeHintException("Callback variable \${$param->getName()} does provide a type hint.");
        } else {
            throw new MissingCallbackArgumentException('Callback does not provide an argument.');
        }
    }

    private function bootstrap($instance): void
    {
        if ($instance instanceof ContainerAwareInterface) {
            $instance->container($this);
            $instance->created();
        }
    }
}
