<?php

namespace Afeefa\ApiResources\Api;

use Afeefa\ApiResources\Field\Field;
use Afeefa\ApiResources\Filter\Filter;
use Afeefa\ApiResources\Model\Model;
use Afeefa\ApiResources\Relation\Relation;
use Afeefa\ApiResources\Validator\Validator;

class SchemaVisitor
{
    /**
     * @var array<Model>
     */
    public array $models = [];

    /**
     * @var array<Field>
     */
    public array $fields = [];

    /**
     * @var array<Relation>
     */
    public array $relations = [];

    /**
     * @var array<Validator>
     */
    public array $validators = [];

    /**
     * @var array<Filter>
     */
    public array $filters = [];

    public function model(Model $model): self
    {
        $this->models[$model->type] = $model;
        return $this;
    }

    public function field(Field $field): self
    {
        $this->fields[$field->type] = $field;
        return $this;
    }

    public function relation(Relation $relation): self
    {
        $this->relations[$relation->type] = $relation;
        return $this;
    }

    public function validator(Validator $validator): self
    {
        $this->validators[$validator->type] = $validator;
        return $this;
    }

    public function filter(Filter $filter): self
    {
        $this->filters[$filter->type] = $filter;
        return $this;
    }
}
