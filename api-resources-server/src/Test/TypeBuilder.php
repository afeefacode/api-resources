<?php

namespace Afeefa\ApiResources\Test;

use Afeefa\ApiResources\Field\FieldBag;
use Afeefa\ApiResources\Type\Type;
use Closure;

class TypeBuilder
{
    public Type $type;

    public function type(
        string $typeName,
        ?Closure $fieldsCallback = null,
        ?Closure $updateFieldsCallback = null,
        ?Closure $createFieldsCallback = null
    ): TypeBuilder {
        $type = new class() extends Type {
            public static ?Closure $fieldsCallback;
            public static ?Closure $updateFieldsCallback;
            public static ?Closure $createFieldsCallback;

            protected function fields(FieldBag $fields): void
            {
                if (static::$fieldsCallback) {
                    (static::$fieldsCallback)->call($this, $fields);
                }
            }

            protected function updateFields(FieldBag $fields): void
            {
                if (static::$updateFieldsCallback) {
                    (static::$updateFieldsCallback)->call($this, $fields);
                }
            }

            protected function createFields(FieldBag $fields): void
            {
                if (static::$createFieldsCallback) {
                    (static::$createFieldsCallback)->call($this, $fields);
                }
            }
        };

        $TypeClass = get_class($type);
        $TypeClass::$type = $typeName;

        $TypeClass::$fieldsCallback = $fieldsCallback;
        $TypeClass::$updateFieldsCallback = $updateFieldsCallback;
        $TypeClass::$createFieldsCallback = $createFieldsCallback;

        $this->type = $type;

        return $this;
    }

    public function get(): Type
    {
        return $this->type;
    }
}
