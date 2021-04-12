import { Action } from 'src/action/Action';
export declare class ApiRequest {
    private _action;
    private _fields;
    private _filters;
    action(action: Action): ApiRequest;
    fields(fields: object): ApiRequest;
    filters(filters: object): ApiRequest;
    send(): Promise<any>;
    protected toParams(): object;
}
//# sourceMappingURL=ApiRequest.d.ts.map