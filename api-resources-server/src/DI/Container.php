<?php

namespace Afeefa\ApiResources\DI;

use Afeefa\ApiResources\Exception\Exceptions\MissingCallbackArgumentException;
use Afeefa\ApiResources\Exception\Exceptions\MissingTypeHintException;
use Afeefa\ApiResources\Exception\Exceptions\NotACallbackException;
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
            $Types = $this->getCallbackArgumentTypes($classOrCallback);
            if (!count($Types)) {
                throw new MissingCallbackArgumentException('Callback does not provide arguments.');
            }
        }

        $arguments = [];
        foreach ($Types as $Type) {
            if (!$this->has($Type)) {
                $this->create($Type, function (Resolver $r) {
                    $r->register();
                });
            }
            $arguments[] = $this->entries[$Type];
        }

        if ($callback) {
            $callback(...$arguments);
        }

        if ($resolveCallback) {
            if ($this->argumentIsResolver($resolveCallback)) {
                foreach ($arguments as $index => $argument) {
                    $resolver = $this->resolver()
                        ->Type(get_class($argument))
                        ->index($index);
                    $resolveCallback($resolver);
                    $resolver->instance($argument);
                }
            } else {
                $resolveCallback(...$arguments);
            }
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
        [$Type, $callback] = $this->classOrCallback($classOrCallback);
        if ($callback) {
            $Types = $this->getCallbackArgumentTypes($classOrCallback);
            if (!count($Types)) {
                throw new MissingCallbackArgumentException('Callback does not provide an argument.');
            } elseif (count($Types) > 1) {
                throw new TooManyCallbackArgumentsException('Callback may only provide 1 argument.');
            }
            $Type = $Types[0];
        }

        $construct = $this->config[$Type] ?? null;
        $instance = $construct ? $construct() : new $Type();
        $this->bootstrapInstance($instance);

        if ($resolveCallback) {
            if ($this->argumentIsResolver($resolveCallback)) {
                $resolver = $this->resolver()
                    ->Type($Type);

                $resolveCallback($resolver);

                if ($resolver->shouldRegister()) {
                    $this->register($Type, $instance);
                }

                $resolver->instance($instance);
            } else {
                $resolveCallback($instance);
            }
        }

        if ($callback) {
            $callback($instance);
        }

        return $instance;
    }

    /**
     * Calls a function while injecting dependencies
     */
    public function call($callback, Closure $resolveCallback = null)
    {
        $callback = $this->callback($callback);
        $Types = $this->getCallbackArgumentTypes($callback);

        $argumentsMap = array_column(
            array_map(function ($Type, $index) use ($resolveCallback) {
                $resolver = $this->resolver()
                    ->Type($Type)
                    ->index($index);

                if ($resolveCallback) {
                    $resolveCallback($resolver);
                }

                $instance = null;
                if ($resolver->getFix()) { // fix value
                    $instance = $resolver->getFix();
                } elseif ($resolver->shouldCreate()) { // create instance
                    $instance = $this->create($Type, $resolveCallback);
                } else { // get or create instance
                    $instance = $this->get($Type);
                }

                $resolver->instance($instance);

                return [$Type, $instance];
            }, $Types, array_keys($Types)),
            1,
            0
        );

        $arguments = array_values($argumentsMap);
        return $callback(...$arguments);
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
        $dump = array_map(function ($key, $entry) {
            return $key;
        }, array_keys($this->entries), $this->entries);

        if ($sort) {
            sort($dump);
        }

        debug_dump($dump);
    }

    public function classOrCallback($classOrCallback): array
    {
        if ($classOrCallback instanceof Closure) {
            return [null, $classOrCallback];
        } elseif (is_callable($classOrCallback)) {
            return [null, Closure::fromCallable($classOrCallback)];
        }
        return [$classOrCallback, null];
    }

    public function callback($callback): Closure
    {
        if ($callback instanceof Closure) {
            return $callback;
        } elseif (is_callable($callback)) {
            return Closure::fromCallable($callback);
        }
        throw new NotACallbackException('Argument is not a callback.');
    }

    protected function resolver(): Resolver
    {
        return new Resolver();
    }

    private function argumentIsResolver($callback): bool
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
