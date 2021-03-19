<?php

namespace Afeefa\ApiResources\DI;

use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackArgumentException;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeHintException;
use Afeefa\ApiResources\Exception\Exceptions\NotACallbackException;
use Afeefa\ApiResources\Exception\Exceptions\NotATypeOrCallbackException;
use Afeefa\ApiResources\Exception\Exceptions\TooManyCallbackArgumentsException;
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
        $this->register(static::class, $this);
    }

    /**
     * Returns a container entry and creates and adds it, if it not exists
     *
     * @param mixed $classOrCallback
     */
    public function get($classOrCallback, Closure $resolveCallback = null): object
    {
        [$Type, $callback] = $this->classOrCallback($classOrCallback);
        if ($Type) {
            $Types = [$Type];
        } else {
            $Types = $this->getCallbackArgumentTypes($callback);
            if (!count($Types)) {
                throw new MissingCallbackArgumentException('Get callback does not provide arguments.');
            }
        }

        $arguments = [];
        foreach ($Types as $Type) {
            if (!$this->has($Type)) {
                $this->createInstance($Type, null, true);
            }
            $arguments[] = $this->entries[$Type];
        }

        if ($callback) {
            $callback(...$arguments);
        }

        if ($resolveCallback) {
            $resolveCallback(...$arguments);
        }

        return $arguments[0];
    }

    public function has(string $Type): bool
    {
        return isset($this->entries[$Type]);
    }

    /**
     * Creates a class but does not add it to the container
     */
    public function create($classOrCallback, Closure $resolveCallback = null): object
    {
        return $this->createInstance($classOrCallback, $resolveCallback);
    }

    private function createInstance($classOrCallback, Closure $resolveCallback = null, $register = false): object
    {
        [$Type, $callback] = $this->classOrCallback($classOrCallback);
        if ($callback) {
            $Types = $this->getCallbackArgumentTypes($classOrCallback);
            if (!count($Types)) {
                throw new MissingCallbackArgumentException('Create callback does not provide an argument.');
            } elseif (count($Types) > 1) {
                throw new TooManyCallbackArgumentsException('Create callback may only provide 1 argument.');
            }
            $Type = $Types[0];
        }

        $construct = $this->config[$Type] ?? null;
        $instance = $construct ? $construct() : new $Type();
        $this->bootstrapInstance($instance);

        if ($register) {
            $this->register($Type, $instance);
        }

        if ($callback) {
            $callback($instance);
        }

        if ($resolveCallback) {
            $resolveCallback($instance);
        }

        return $instance;
    }

    /**
     * Calls a function while injecting dependencies
     */
    public function call($callback, Closure $resolveCallback = null, Closure $resolveCallback2 = null)
    {
        $callback = $this->callback($callback);
        $Types = $this->getCallbackArgumentTypes($callback);
        $resolveCallbackExpectsResolver = $resolveCallback && $this->argumentIsResolver($resolveCallback);

        $argumentsMap = array_column(
            array_map(function ($Type, $index) use ($resolveCallback, $resolveCallbackExpectsResolver) {
                $instance = null;

                if ($resolveCallbackExpectsResolver) {
                    $resolver = $this->resolver()
                        ->Type($Type)
                        ->index($index);

                    if ($resolveCallback) {
                        $resolveCallback($resolver);
                    }

                    if ($resolver->getFix()) { // fix value
                        $instance = $resolver->getFix();
                    } elseif ($resolver->shouldCreate()) { // create instance
                        $instance = $this->createInstance($Type);
                    }
                }

                if (!$instance) {
                    $instance = $this->get($Type);
                }

                return [$Type, $instance];
            }, $Types, array_keys($Types)),
            1,
            0
        );

        $arguments = array_values($argumentsMap);

        $result = $callback(...$arguments);

        if ($resolveCallback && !$resolveCallbackExpectsResolver) {
            $resolveCallback(...$arguments);
        }

        if ($resolveCallback2) {
            $resolveCallback2(...$arguments);
        }

        return $result;
    }

    /**
     * Returns all container entries
     */
    public function entries(): array
    {
        return $this->entries;
    }

    public function dumpEntries($sort = false)
    {
        $dump = array_column(
            array_map(function ($key, $entry) {
                return [$key, get_class($entry)];
            }, array_keys($this->entries), $this->entries),
            1,
            0
        );

        if ($sort) {
            sort($dump);
        }

        debug_dump($dump);
    }

    private function resolver(): Resolver
    {
        return new Resolver();
    }

    private function classOrCallback($classOrCallback): array
    {
        if ($classOrCallback instanceof Closure) {
            return [null, $classOrCallback];
        } elseif (is_callable($classOrCallback)) {
            return [null, Closure::fromCallable($classOrCallback)];
        }

        if (!is_string($classOrCallback) || !class_exists($classOrCallback)) {
            throw new NotATypeOrCallbackException('Argument is not a type nor a valid callback.');
        }

        return [$classOrCallback, null];
    }

    private function callback($callback): Closure
    {
        if ($callback instanceof Closure) {
            return $callback;
        } elseif (is_callable($callback)) {
            return Closure::fromCallable($callback);
        }
        throw new NotACallbackException('Argument is not a callback.');
    }

    private function argumentIsResolver(Closure $callback): bool
    {
        $Types = $this->getCallbackArgumentTypes($callback);
        return (count($Types) === 1 && $Types[0] === Resolver::class);
    }

    private function register(string $Type, object $instance)
    {
        if (!isset($this->entries[$Type])) {
            $this->entries[$Type] = $instance;
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
