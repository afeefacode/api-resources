import { AxiosResponse } from 'axios';
import { Model, ModelJSON } from '../Model';
import { ApiRequest } from './ApiRequest';
export type ApiResponseDataJSON = ModelJSON | ModelJSON[];
export type ApiResponseJSON = {
    data: ApiResponseDataJSON;
    meta: object;
};
export declare class ApiResponse {
    data: Model | Model[] | null;
    meta: object;
    request: ApiRequest;
    constructor(request: ApiRequest, response: AxiosResponse<ApiResponseJSON>);
    protected toModel(json: ModelJSON): Model;
}
//# sourceMappingURL=ApiResponse.d.ts.map