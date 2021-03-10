<?php

namespace Afeefa\ApiResources\Api;

interface ToSchemaJsonInterface
{
    public function toSchemaJson(SchemaVisitor $visitor): array;
}
