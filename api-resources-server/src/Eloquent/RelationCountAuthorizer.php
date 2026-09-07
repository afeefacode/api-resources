<?php

namespace Afeefa\ApiResources\Eloquent;

use Afeefa\ApiResources\Api\Authorizator;
use Afeefa\ApiResources\Field\Relation;
use Afeefa\ApiResources\V2\Operation;
use Closure;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;

/**
 * Builds the withCount() constraint of a counted relation.
 *
 * A relation count is the same relation as the nested read below it: if both
 * are requested, number and list have to match, so the read rule of the target
 * type has to reach the count subquery as well.
 *
 * @internal
 */
class RelationCountAuthorizer
{
    public static function constraint(?Authorizator $authorizator, Relation $relation): Closure
    {
        $typeNames = $relation->getRelatedType()->getAllTypeNames();

        return function (EloquentBuilder $query) use ($authorizator, $typeNames): void {
            // More than one possible target type means the rows counted in this
            // single subquery belong to different types - there is no one rule
            // to apply. Eloquent cannot count such a relation anyway.
            if (!$authorizator || count($typeNames) !== 1) {
                return;
            }

            $authorizator->applyAuthorizeForTypeName(
                $typeNames[0],
                Operation::READ,
                new EloquentAuthContext($query)
            );
        };
    }
}
