<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\Exception\Exceptions\NotATypeException;
use Afeefa\ApiResources\Filter\FilterBag;
use Closure;

class Action extends BagEntry
{
    protected string $name;

    protected ActionParams $params;

    protected ActionInput $input;

    protected FilterBag $filters;

    protected ActionResponse $response;

    protected Closure $executor;

    /**
     * @var string|callable|Closure
     */
    protected $resolveCallback;

    public function name(string $name): Action
    {
        $this->name = $name;
        return $this;
    }

    public function params(Closure $callback): Action
    {
        $this->container->create($callback, function (ActionParams $params) {
            $this->params = $params;
        });
        return $this;
    }

    public function input(string $Type, Closure $callback = null): Action
    {
        if (!class_exists($Type)) {
            throw new NotATypeException('Value for input $Type is not a type.');
        }

        $this->input = $this->container->create(ActionInput::class);

        $this->input->type($Type);

        if ($callback) {
            $callback($this->input);
        }

        return $this;
    }

    public function getInput(): ActionInput
    {
        return $this->input;
    }

    public function filters(Closure $callback): Action
    {
        $this->container->create($callback, function (FilterBag $filters) {
            $this->filters = $filters;
        });
        return $this;
    }

    public function response($TypeOrTypes, Closure $callback = null): Action
    {
        $this->response = $this->container->create(ActionResponse::class);

        if (is_array($TypeOrTypes)) {
            foreach ($TypeOrTypes as $Type) {
                if (!class_exists($Type)) {
                    throw new NotATypeException('Value for response $TypeOrTypes is not a list of types.');
                }
            }
            $this->response->types($TypeOrTypes);
        } elseif (is_string($TypeOrTypes)) {
            if (!class_exists($TypeOrTypes)) {
                throw new NotATypeException('Value for response $TypeOrTypes is not a type.');
            }
            $this->response->type($TypeOrTypes);
        } else {
            throw new NotATypeException('Value for response $TypeOrTypes is not a type or a list of type.');
        }

        if ($callback) {
            $callback($this->response);
        }

        return $this;
    }

    public function getResponse(): ActionResponse
    {
        return $this->response;
    }

    /**
     * @param string|callable|Closure $classOrCallback
     */
    public function resolve($classOrCallback): Action
    {
        $this->resolveCallback = $classOrCallback;
        return $this;
    }

    public function run()
    {
        $callback = $this->resolveCallback;
        if (is_array($callback) && is_string($callback[0])) {
            $callback[0] = $this->container->create($callback[0]);
        }

        return $this->container->call($callback);
    }

    public function toSchemaJson(): array
    {
        $json = [
            // 'name' => $this->name
        ];

        if (isset($this->params)) {
            $json['params'] = $this->params->toSchemaJson();
        }

        if (isset($this->input)) {
            $json['input'] = $this->input->toSchemaJson();
        }

        if (isset($this->filters)) {
            $json['filters'] = $this->filters->toSchemaJson();
        }

        if (isset($this->response)) {
            $json['response'] = $this->response->toSchemaJson();
        }

        return $json;
    }
}
