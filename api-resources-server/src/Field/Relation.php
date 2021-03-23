<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Api\RequestParams;
use Afeefa\ApiResources\Api\TypeRegistry;
use Afeefa\ApiResources\Type\Type;
use Closure;

/**
 * @method Relation name(string $name)
 * @method Relation validate(Closure $callback)
 * @method Relation validator(Validator $validator)
 * @method Relation required(bool $required = true)
 * @method Relation allowed()
 * @method Relation resolver(string|callable|Closure $classOrCallback)
 */
class Relation extends Field
{
    protected string $RelatedType;

    protected RequestParams $params;

    protected bool $isSingle = false;

    public function created(): void
    {
        parent::created();

        $this->params = new RequestParams();
    }

    public function isSingle(): bool
    {
        return $this->isSingle;
    }

    public function params(): RequestParams
    {
        return $this->params;
    }

    public function relatedType(string $RelatedType): Relation
    {
        $this->RelatedType = $RelatedType;

        return $this;
    }

    public function getRelatedType(): string
    {
        return $this->RelatedType;
    }

    public function getRelatedTypeInstance(): Type
    {
        return $this->container->get($this->RelatedType);
    }

    public function clone(): Relation
    {
        /** @var Relation */
        $relation = parent::clone();
        $relation->relatedType($this->RelatedType);
        return $relation;
    }

    public function getSchemaJson(TypeRegistry $typeRegistry): array
    {
        $json = parent::getSchemaJson($typeRegistry);

        $typeRegistry->registerType($this->RelatedType);

        return array_merge(
            $json,
            [
                'related_type' => $this->RelatedType::$type
            ]
        );
    }
}
