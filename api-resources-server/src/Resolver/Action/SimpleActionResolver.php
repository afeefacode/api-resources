<?php

namespace Afeefa\ApiResources\Resolver\Action;

use Closure;

class SimpleActionResolver extends BaseActionResolver
{
    protected ?Closure $doCallback = null;

    public function do(Closure $callback): static
    {
        $this->doCallback = $callback;
        return $this;
    }

    public function resolve(): array
    {
        ($this->doCallback)($this->getRequest());

        return [];
    }
}
