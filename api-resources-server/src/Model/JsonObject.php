<?php

namespace Afeefa\ApiResources\Model;

class JsonObject extends Model
{
    public string $type = 'Afeefa.JsonObject';

    public function jsonSerialize()
    {
        foreach ($this as $name => $value) {
            if ($name === 'visibleFields') {
                continue;
            }
            $this->visibleFields[] = $name;
        }

        $json = parent::jsonSerialize();
        return $json;
    }
}
