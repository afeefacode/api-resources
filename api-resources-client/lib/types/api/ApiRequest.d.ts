import { Action } from '../action/Action';
import { ApiResponse } from './ApiResponse';
export declare type ApiRequestJSON = {
    resource: string;
    action: string;
    fields: Record<string, unknown>;
    filters: Record<string, unknown>;
    params: Record<string, unknown>;
};
export declare class ApiRequest {
    private _action;
    private _fields;
    private _filters;
    private _params;
    private _data;
    private _lastRequestJSON;
    private _lastRequest;
    constructor(json?: ApiRequestJSON);
    action(action: Action): ApiRequest;
    getAction(): Action;
    fields(fields: Record<string, unknown>): ApiRequest;
    filters(filters: Record<string, unknown>): ApiRequest;
    params(params: Record<string, unknown>): ApiRequest;
    data(data: Record<string, unknown>): ApiRequest;
    send(): Promise<ApiResponse>;
    protected serialize(): object;
}
//# sourceMappingURL=ApiRequest.d.ts.map