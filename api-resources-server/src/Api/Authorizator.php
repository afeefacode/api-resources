<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\V2\Operation;

/**
 * Container entry holding the authorization rules of the application.
 *
 * The Api fills it in configureAuth(); everyone who needs a rule asks the
 * container for the Authorizator - framework resolvers and own actions alike.
 * A resolver therefore never needs access to the Api.
 */
class Authorizator implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    /** @var array<string, AuthConfigurator> keyed by type string */
    protected array $configurators = [];

    /**
     * Returns the configurator of the given type, creating it on first call.
     *
     * Keyed by type string, not by class: a project may swap the class for this
     * type via overrideTypes(), and the rule has to follow the type.
     *
     * @internal registration goes through Api::authorize()
     */
    public function configure(string $typeClass): AuthConfigurator
    {
        $typeName = $typeClass::type();
        if (!isset($this->configurators[$typeName])) {
            $this->configurators[$typeName] = new AuthConfigurator();
        }
        return $this->configurators[$typeName];
    }

    /**
     * Applies the rule registered for (type, operation) to the given context.
     *
     * This is the one public entry point: no Eloquent in its signature. Whoever
     * works with Eloquent builds an EloquentAuthContext around their query,
     * every other data source brings its own context.
     */
    public function applyAuthorize(string $typeClass, Operation $operation, AuthContext $context): void
    {
        $this->applyAuthorizeForTypeName($typeClass::type(), $operation, $context);
    }

    /**
     * Same as applyAuthorize(), for paths that only know the type string - a
     * nested read knows its target type by name, a saved model carries it in
     * Model::$type.
     *
     * @internal
     */
    public function applyAuthorizeForTypeName(string $typeName, Operation $operation, AuthContext $context): void
    {
        $rule = $this->getAuthorize($typeName, $operation);
        if ($rule) {
            $rule->call($context, $this->container);
        }
    }

    /**
     * Returns the rule of the given slot, or null if nothing is registered for
     * (type, operation) - in which case access is unrestricted.
     *
     * @internal
     */
    public function getAuthorize(string $typeName, Operation $operation): ?AuthRule
    {
        return ($this->configurators[$typeName] ?? null)?->getRule($operation);
    }

    public function hasAuthorize(string $typeName, Operation $operation): bool
    {
        return $this->getAuthorize($typeName, $operation) !== null;
    }
}
