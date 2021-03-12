<?php

namespace Afeefa\ApiResources\DI;

trait ContainerAwareTrait
{
    public Container $container;

    public function container(Container $container): void
    {
        $this->container = $container;
    }

    public function created(): void
    {
    }
}
