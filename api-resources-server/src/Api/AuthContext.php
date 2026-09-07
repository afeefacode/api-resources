<?php

namespace Afeefa\ApiResources\Api;

/**
 * Base class of every authorization context.
 *
 * A context is built solely for authorizing a single access to a type. It knows
 * nothing about the running request - no params, no requested fields, no action.
 * All it can do is deny, and whatever narrowing primitive the concrete data
 * source adds on top (see EloquentAuthContext::query()).
 *
 * Rules always deny via deny(), never with an own throw: which exception is
 * used is a convention that may change, and it should change in one place
 * instead of in every registered closure.
 */
abstract class AuthContext
{
    /**
     * Denies access to the current object or row.
     *
     * Always a NotFoundException, for a blocked action just as for a row that
     * is out of scope: the outside must not be able to tell a locked resource
     * apart from a missing one.
     */
    public function deny(): never
    {
        throw new NotFoundException('Model not found');
    }
}
