<?php

namespace Afeefa\ApiResources\Test;

function T(string $type): string
{
    return TypeRegistry::getOrCreate($type)::class;
}
