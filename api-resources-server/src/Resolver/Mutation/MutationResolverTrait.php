<?php

namespace Afeefa\ApiResources\Resolver\Mutation;

use Afeefa\ApiResources\Api\Operation;
use Afeefa\ApiResources\Model\ModelInterface;
use Closure;

trait MutationResolverTrait
{
    protected array $ownerSaveFields = [];

    public function ownerSaveFields(array $ownerSaveFields): self
    {
        $this->ownerSaveFields = $ownerSaveFields;
        return $this;
    }

    protected function resolveModel(string $operation, string $typeName, array $fieldsToSave, Closure $resolveCallback): ModelInterface
    {
        $resolveContext = $this->createResolveContext($typeName, $fieldsToSave);

        // resolve related before this

        $relatedSaveFields = [];

        $relationResolvers = $resolveContext->getRelationResolvers();

        $owner = $this->owners[0] ?? null;

        foreach ($relationResolvers as $relationResolver) {
            if ($relationResolver->shouldSaveRelatedToOwner()) {
                $relationResolver->ownerOperation(Operation::CREATE); // only create

                // if ($owner) {
                //     $relationResolver->addOwner($owner);
                // }

                $relationResolver->resolve(); // model to save in the owner
                $relatedSaveFields = $relationResolver->getSaveRelatedToOwnerFields();
            }
        }

        // resolve this

        $saveFields = array_merge($resolveContext->getSaveFields(), $this->ownerSaveFields, $relatedSaveFields);

        $related = $resolveCallback($saveFields);

        // resolve related after this

        foreach ($relationResolvers as $relationResolver) {
            if ($relationResolver->shouldSaveRelatedToOwner()) {
                continue; // already resolved
            }

            $ownerSaveFields = [];

            // save owner field to related

            if ($relationResolver->shouldSaveOwnerToRelated()) {
                $ownerSaveFields = $relationResolver->getSaveOwnerToRelatedFields(
                    $related->apiResourcesGetId(),
                    $related->apiResourcesGetType()
                );
            }

            $relationResolver
                ->ownerOperation($operation)
                ->addOwner($related)
                ->ownerSaveFields($ownerSaveFields)
                ->resolve();
        }

        return $related;
    }

    private function createResolveContext(string $typeName, array $fieldsToSave): MutationResolveContext
    {
        return $this->container->create(MutationResolveContext::class)
            ->type($this->getTypeByName($typeName))
            ->fieldsToSave($fieldsToSave);
    }
}
