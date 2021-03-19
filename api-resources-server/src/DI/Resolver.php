<?php

namespace Afeefa\ApiResources\DI;

use Closure;

class Resolver
{
    protected string $Type;

    protected int $index = 0;

    protected ?object $fix = null;

    protected ?object $instance = null;

    protected bool $create = false;

    protected bool $register = false;

    protected ?Closure $resolvedCallback = null;

    public function register(): Resolver
    {
        $this->register = true;
        return $this;
    }

    public function shouldRegister(): bool
    {
        return $this->register;
    }

    public function resolved(Closure $resolvedCallback): Resolver
    {
        $this->resolvedCallback = $resolvedCallback;
        return $this;
    }

    public function type(string $Type): Resolver
    {
        $this->Type = $Type;
        return $this;
    }

    public function index(int $index): Resolver
    {
        $this->index = $index;
        return $this;
    }

    public function fix(object $fix): Resolver
    {
        $this->fix = $fix;
        return $this;
    }

    public function getFix(): ?object
    {
        return $this->fix;
    }

    public function instance(object $instance): Resolver
    {
        $this->instance = $instance;
        if ($this->resolvedCallback) {
            $callback = $this->resolvedCallback;
            $callback($instance);
        }
        return $this;
    }

    public function create(): Resolver
    {
        $this->create = true;
        return $this;
    }

    public function shouldCreate(): bool
    {
        return $this->create;
    }

    public function isOf(string $Type): bool
    {
        if ($this->Type === $Type) {
            return true;
        }

        $isSubclass = is_subclass_of($this->Type, $Type);
        return $isSubclass;
    }
}
