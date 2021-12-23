<?php

namespace Afeefa\ApiResources\Resolver;

use Afeefa\ApiResources\Action\ActionResponse;
use Afeefa\ApiResources\DB\TypeClassMap;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Exception\Exceptions\InvalidConfigurationException;
use Afeefa\ApiResources\Model\ModelInterface;
use Afeefa\ApiResources\Type\Type;

class BaseResolver implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected array $resolveContexts = [];

    protected array $requestedFields = [];

    public function getRequestedFields(?string $typeName = null): array
    {
        if (!isset($this->requestedFields[$typeName])) {
            $this->requestedFields[$typeName] = $this->calculateRequestedFields($typeName);
        }

        return $this->requestedFields[$typeName];
    }

    public function getRequestedFieldNames(?string $typeName = null): array
    {
        return array_keys($this->getRequestedFields($typeName));
    }

    public function fieldIsRequested(string $fieldName, ?string $typeName = null): bool
    {
        return array_key_exists($fieldName, $this->getRequestedFields($typeName));
    }

    protected function calculateRequestedFields(?string $typeName = null): array
    {
        return [];
    }

    protected function getTypeByName(string $typeName): Type
    {
        return $this->container->call(function (TypeClassMap $typeClassMap) use ($typeName) {
            $TypeClass = $typeClassMap->get($typeName) ?? Type::class;
            return $this->container->get($TypeClass);
        });
    }

    /**
     * @param ModelInterface[] $models
     */
    protected function sortModelsByType(array $models): array
    {
        $modelsByType = [];
        foreach ($models as $model) {
            $type = $model->apiResourcesGetType();
            $modelsByType[$type][] = $model;
        }
        return $modelsByType;
    }

    protected function getResolveContext(string $typeName, array $fields): QueryResolveContext
    {
        if (!isset($this->resolveContexts[$typeName])) {
            $this->resolveContexts[$typeName] = $this->container->create(function (QueryResolveContext $resolveContext) use ($typeName, $fields) {
                $resolveContext
                    ->type($this->getTypeByName($typeName))
                    ->fields($fields);
            });
        }

        return $this->resolveContexts[$typeName];
    }

    protected function validateRequestedType(ActionResponse $response, ?string $typeName, string $noTypeMessage, string $wrongTypeMessage): string
    {
        if ($response->isUnion()) {
            if (!$typeName) {
                throw new InvalidConfigurationException($noTypeMessage);
            }
        } else {
            $typeName ??= $response->getTypeClass()::type();
        }

        if (!$response->allowsType($typeName)) {
            throw new InvalidConfigurationException($wrongTypeMessage);
        }

        return $typeName;
    }

    protected function resolveModels(array $models, array $fields): void
    {
        $modelsByType = $this->sortModelsByType($models);

        foreach ($modelsByType as $typeName => $models) {
            $resolveContext = $this->getResolveContext($typeName, $fields);

            // resolve attributes

            foreach ($resolveContext->getAttributeResolvers() as $attributeResolver) {
                $attributeResolver->addOwners($models);
                $attributeResolver->resolve();
            }

            // resolve relations

            foreach ($resolveContext->getRelationResolvers() as $relationResolver) {
                $relationResolver->addOwners($models);
                $relationResolver->resolve();
            }

            // mark visible fields

            $getRequestedFieldNames = $this->getRequestedFieldNames($typeName);
            foreach ($models as $model) {
                $visibleFields = ['id', 'type', ...$getRequestedFieldNames];
                $model->apiResourcesSetVisibleFields($visibleFields);
            }
        }
    }
}
