<?php

namespace Afeefa\ApiResources\Filter;

use Afeefa\ApiResources\Api\Api;
use Afeefa\ApiResources\Api\ApiRequest;
use Afeefa\ApiResources\Bag\BagEntry;
use Afeefa\ApiResources\Utils\HasStaticTypeTrait;
use Closure;

class Filter extends BagEntry
{
    use HasStaticTypeTrait;

    protected string $name;

    protected array $options;

    protected Closure $optionsRequestCallback;

    protected $default;

    protected bool $allowNull = false;

    protected bool $defaultValueSet = false;

    public function created(): void
    {
        $this->setup();
    }

    public function optionsRequest(Closure $callback): Filter
    {
        $this->optionsRequestCallback = $callback;
        return $this;
    }

    public function name(string $name): Filter
    {
        $this->name = $name;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function allowNull(bool $allowNull = true): Filter
    {
        $this->allowNull = $allowNull;
        return $this;
    }

    public function nullIsAllowed(): bool
    {
        return $this->allowNull || $this->hasOption(null);
    }

    public function default($default): Filter
    {
        $this->default = $default;
        $this->defaultValueSet = true;
        return $this;
    }

    public function hasDefaultValue(): bool
    {
        return $this->defaultValueSet;
    }

    public function getDefaultValue()
    {
        return $this->default;
    }

    public function options(array $options): Filter
    {
        $this->options = $options;
        return $this;
    }

    public function hasOption($option): bool
    {
        return isset($this->options) && in_array($option, $this->options);
    }

    public function getOptions(): array
    {
        return $this->options ?? [];
    }

    public function toSchemaJson(): array
    {
        $json = [
            'type' => $this::type()
        ];

        if ($this->defaultValueSet) {
            $json['default'] = $this->default;
        }

        if (isset($this->options)) {
            $json['options'] = $this->options;
        } elseif (isset($this->optionsRequestCallback)) {
            $api = $this->container->get(Api::class);
            $request = $this->container->create(function (ApiRequest $request) use ($api) {
                $request->api($api);
                ($this->optionsRequestCallback)($request);
            });
            $json['options_request'] = $request->toSchemaJson();
        }

        if ($this->nullIsAllowed()) {
            $json['allow_null'] = true;
        }

        return $json;
    }

    protected function setup(): void
    {
    }
}
