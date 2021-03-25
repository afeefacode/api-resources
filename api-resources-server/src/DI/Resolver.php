<?php

namespace Afeefa\ApiResources\DI;

class Resolver
{
    protected string $TypeClass;

    protected int $index = 0;

    protected ?object $fix = null;

    protected bool $create = false;

    public function typeClass(string $TypeClass): Resolver
    {
        $this->TypeClass = $TypeClass;
        return $this;
    }

    public function getTypeClass(): string
    {
        return $this->TypeClass;
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

    public function isOf(string $TypeClass): bool
    {
        if ($this->TypeClass === $TypeClass) {
            return true;
        }

        $isSubclass = is_subclass_of($this->TypeClass, $TypeClass);
        return $isSubclass;
    }
}
