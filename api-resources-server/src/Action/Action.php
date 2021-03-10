<?php

namespace Afeefa\ApiResources\Action;

use Afeefa\ApiResources\Api\SchemaVisitor;
use Afeefa\ApiResources\Api\ToSchemaJsonInterface;
use Afeefa\ApiResources\Filter\FilterBag;

class Action implements ToSchemaJsonInterface
{
    public string $name;

    public ActionParams $params;

    public ActionInput $input;

    public FilterBag $filters;

    public ActionResponse $response;

    public function params(callable $callback): Action
    {
        $params = new ActionParams();
        $callback($params);
        $this->params = $params;
        return $this;
    }

    public function input(callable $callback): Action
    {
        $input = new ActionInput();
        $callback($input);
        $this->input = $input;
        return $this;
    }

    public function filters(callable $callback): Action
    {
        $filters = new FilterBag();
        $callback($filters);
        $this->filters = $filters;
        return $this;
    }

    public function response(callable $callback): Action
    {
        $response = new ActionResponse();
        $callback($response);
        $this->response = $response;
        return $this;
    }

    public function toSchemaJson(SchemaVisitor $visitor): array
    {
        $json = [
            // 'name' => $this->name
        ];

        if (isset($this->params)) {
            $json['params'] = $this->params->toSchemaJson($visitor);
        }

        if (isset($this->input)) {
            $json['input'] = $this->input->toSchemaJson($visitor);
        }

        if (isset($this->filters)) {
            $json['filters'] = $this->filters->toSchemaJson($visitor);
        }

        if (isset($this->response)) {
            $json['response'] = $this->response->toSchemaJson($visitor);
        }

        return $json;
    }
}
