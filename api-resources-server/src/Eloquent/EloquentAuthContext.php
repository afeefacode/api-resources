<?php

namespace Afeefa\ApiResources\Eloquent;

use Afeefa\ApiResources\Api\AuthContext;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Relations\Relation as EloquentRelation;
use Illuminate\Database\Query\Expression;

/**
 * Authorization context of every Eloquent based path.
 *
 * Narrowing primitive is the query itself: a rule adds its where clauses to
 * what query() returns.
 */
class EloquentAuthContext extends AuthContext
{
    /**
     * $tablePrefix names the target table explicitly, for the paths where the
     * query does not carry it: a MorphTo whose type is not resolved yet sits on
     * the query of its parent, so its from part names the owner table.
     */
    public function __construct(
        protected EloquentBuilder|EloquentRelation $query,
        protected ?string $tablePrefix = null
    ) {
    }

    /**
     * The query the rule narrows down.
     *
     * On an eager load this is the relation, not its builder: a MorphTo replays
     * the calls it receives on each of its per-type queries, and reaching past
     * it to the builder would drop them.
     */
    public function query(): EloquentBuilder|EloquentRelation
    {
        return $this->query;
    }

    /**
     * The name the target table carries in exactly this query - its alias, if
     * Eloquent gave it one.
     *
     * A hand written table name cannot do that: it is fixed when the rule is
     * written, the prefix only when it runs, and it is not foreseeable when one
     * is assigned (Eloquent aliases a self relation, among others). Rules put
     * this in front of their columns.
     */
    public function getTablePrefix(): string
    {
        if ($this->tablePrefix !== null) {
            return $this->tablePrefix;
        }

        $query = $this->query instanceof EloquentRelation
            ? $this->query->getQuery()
            : $this->query;

        $from = $query->getQuery()->from;

        if ($from instanceof Expression) { // subquery as source, no name to qualify with
            return $query->getModel()->getTable();
        }

        // "table as alias" - the alias is what the rest of the query refers to
        if (preg_match('/\s+as\s+(\S+)\s*$/i', $from, $matches)) {
            return trim($matches[1], '`"[]');
        }

        return $from;
    }
}
