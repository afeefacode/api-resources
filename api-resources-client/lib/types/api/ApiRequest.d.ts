import { Action } from '../action/Action';
export declare type ApiRequestJSON = {
    resource: string;
    action: string;
    fields: Record<string, unknown>;
    filters: Record<string, unknown>;
};
export declare class ApiRequest {
    private _action;
    private _fields;
    private _filters;
    constructor(json?: ApiRequestJSON);
    action(action: Action): ApiRequest;
    fields(fields: Record<string, unknown>): ApiRequest;
    filters(filters: Record<string, unknown>): ApiRequest;
    send(): Promise<any>;
    protected toParams(): object;
}
//# sourceMappingURL=ApiRequest.d.ts.map