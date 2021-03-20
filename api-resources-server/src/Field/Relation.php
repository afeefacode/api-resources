<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Api\RequestParams;
use Afeefa\ApiResources\Api\TypeRegistry;
use Afeefa\ApiResources\Type\Type;

/**
 * @method Relation name(string $name)
 * @method Relation validate(Closure $callback)
 * @method Relation validator(Validator $validator)
 * @method Relation required(bool $required = true)
 * @method Relation allowed()
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

    public function getRelatedTypeInstance(): Type
    {
        return $this->container->get($this->RelatedType);
    }

    public function clone(): Relation
    {
        return $this->container->create(static::class, function (Relation $relation) {
            $relation
                ->name($this->name)
                ->relatedType($this->RelatedType)
                ->required($this->required);
        });
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
