<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Api\ToSchemaJsonTrait;
use Afeefa\ApiResources\DI\ContainerAwareInterface;
use Afeefa\ApiResources\DI\ContainerAwareTrait;
use Afeefa\ApiResources\Exception\Exceptions\NotATypeException;
use Afeefa\ApiResources\Type\Type;
use Afeefa\ApiResources\Type\TypeMeta;
use Closure;

class ActionResponse implements ToSchemaJsonInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;
    use ToSchemaJsonTrait;

    protected bool $list = false;

    protected string $TypeClass;

    protected array $TypeClasses;

    public function initFromArgument($TypeClassOrClassesOrMeta, Closure $callback = null): ActionResponse
    {
        $valueFor = $this->getNameForException();
        $argumentName = $this->getArgumentNameForException();

        if ($TypeClassOrClassesOrMeta instanceof TypeMeta) {
            $typeMeta = $TypeClassOrClassesOrMeta;
            $TypeClassOrClasses = $typeMeta->TypeClassOrClasses;

            $this->list($typeMeta->list);

            if ($this instanceof ActionInput) {
                $this
                    ->create($typeMeta->create)
                    ->update($typeMeta->update);
            }
        } else {
            $TypeClassOrClasses = $TypeClassOrClassesOrMeta;
        }

        // make array [Type] to string Type
        if (is_array($TypeClassOrClasses) && count($TypeClassOrClasses) === 1) {
            $TypeClassOrClasses = $TypeClassOrClasses[0];
        }

        if (is_array($TypeClassOrClasses)) {
            foreach ($TypeClassOrClasses as $TypeClass) {
                if (!class_exists($TypeClass)) {
                    throw new NotATypeException("Value for {$valueFor} {$argumentName} is not a list of types.");
                }
            }
            $this->typeClasses($TypeClassOrClasses);
        } elseif (is_string($TypeClassOrClasses)) {
            if (!class_exists($TypeClassOrClasses)) {
                throw new NotATypeException("Value for {$valueFor} {$argumentName} is not a type.");
            }
            $this->typeClass($TypeClassOrClasses);
        } else {
            throw new NotATypeException("Value for {$valueFor} {$argumentName} is not a type or a list of types.");
        }

        if ($callback) {
            $callback($this);
        }

        return $this;
    }

    public function typeClass(string $TypeClass): ActionResponse
    {
        $this->TypeClass = $TypeClass;

        return $this;
    }

    public function getTypeClass(): ?string
    {
        return $this->TypeClass ?? null;
    }

    public function getTypeInstance(): Type
    {
        return $this->container->get($this->RelatedTypeClass);
    }

    public function typeClasses(array $TypeClasses): ActionResponse
    {
        $this->TypeClasses = $TypeClasses;
        return $this;
    }

    public function getTypeClasses(): array
    {
        return $this->TypeClasses ?? [];
    }

    public function getAllTypeClasses(): array
    {
        if (isset($this->TypeClass)) {
            return [$this->TypeClass];
        }
        return $this->TypeClasses;
    }

    public function list(): ActionResponse
    {
        $this->list = true;
        return $this;
    }

    public function isList(): bool
    {
        return $this->list;
    }

    public function toSchemaJson(): array
    {
        $json = [];

        if (isset($this->TypeClass)) {
            $json['type'] = $this->TypeClass::type();
        } else {
            $json['types'] = array_map(function ($TypeClass) {
                return $TypeClass::type();
            }, $this->TypeClasses);
        }

        if ($this->list) {
            $json['list'] = true;
        }

        return $json;
    }

    protected function getNameForException(): string
    {
        return 'response';
    }

    protected function getArgumentNameForException(): string
    {
        return '$TypeClassOrClasses';
    }
}
