<?php

namespace Afeefa\ApiResources\Field;

use Afeefa\ApiResources\Type\RelatedType;
use Closure;

/**
 * @method Relation owner($owner)
 * @method Relation name(string $name)
 * @method Relation validate(Closure $callback)
 * @method Relation validator(Validator $validator)
 * @method Relation required(bool $required = true)
 * @method Relation resolve(string|callable|Closure $classOrCallback)
 * @method Relation resolveParam(string $key, $value)
 * @method Relation resolveParams(array $params)
 */
class Relation extends Field
{
    protected static string $type = 'Afeefa.Relation';

    protected RelatedType $relatedType;

    public function typeClassOrClassesOrMeta($TypeClassOrClassesOrMeta): Relation
    {
        $this->relatedType = $this->container->create(RelatedType::class)
            ->relationName($this->name)
            ->initFromArgument($TypeClassOrClassesOrMeta);
        return $this;
    }

    public function getRelatedType(): RelatedType
    {
        return $this->relatedType;
    }

    public function clone(): Relation
    {
        /** @var Relation */
        $relation = parent::clone();
        $relation->relatedType = $this->relatedType;
        return $relation;
    }

    public function toSchemaJson(): array
    {
        $json = parent::toSchemaJson();

        $json['related_type'] = $this->relatedType->toSchemaJson();

        return $json;
    }
}
