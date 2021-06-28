import { Action } from '../action/Action';
import { ApiError } from './ApiError';
import { ApiResponse } from './ApiResponse';
export declare type ApiRequestJSON = {
    resource: string;
    action: string;
    scopes: Record<string, unknown>;
    filters: Record<string, unknown>;
    fields: Record<string, unknown>;
    params: Record<string, unknown>;
};
export declare class ApiRequest {
    private _action;
    private _fields;
    private _scopes;
    private _filters;
    private _params;
    private _data;
    constructor(json?: ApiRequestJSON);
    action(action: Action): ApiRequest;
    getAction(): Action;
    fields(fields: Record<string, unknown>): ApiRequest;
    addField(name: string, value: unknown): ApiRequest;
    scopes(scopes: Record<string, unknown>): ApiRequest;
    filters(filters: Record<string, unknown>): ApiRequest;
    params(params: Record<string, unknown>): ApiRequest;
    data(data: Record<string, unknown>): ApiRequest;
    send(): Promise<ApiResponse | ApiError>;
    protected serialize(): object;
}
//# sourceMappingURL=ApiRequest.d.ts.map