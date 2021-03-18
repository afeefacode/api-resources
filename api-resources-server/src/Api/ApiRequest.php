<?php

namespace Afeefa\ApiResources\Api;

class ApiRequest
{
    protected $resourceId;

    public static function fromInput()
    {
        $input = json_decode(file_get_contents('php://input'), false);

        $resourceId = $input->resource;

        $request = new ApiRequest();
        $request->resourceId = $resourceId;
        return $request;
    }
}
