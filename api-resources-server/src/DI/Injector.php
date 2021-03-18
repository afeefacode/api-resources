<?php

namespace Afeefa\ApiResources\DI;

class Injector
{
    public ?object $instance = null;

    public bool $create = false;

    public bool $register = false;
}
