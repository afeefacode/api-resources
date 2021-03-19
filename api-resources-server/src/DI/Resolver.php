<?php

namespace Afeefa\ApiResources\DI;

class Resolver
{
    protected string $Type;

    protected int $index = 0;

    protected ?object $fix = null;

    protected bool $create = false;

    public function Type(string $Type): Resolver
    {
        $this->Type = $Type;
        return $this;
    }

    public function getType(): string
    {
        return $this->Type;
    }

    public function index(int $index): Resolver
    {
        $this->index = $index;
        return $this;
    }

    public function getIndex(): int
    {
        return $this->index;
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
