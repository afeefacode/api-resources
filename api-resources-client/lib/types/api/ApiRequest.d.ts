import { BagEntries } from 'src/bag/Bag';
import { ActionFilterValueType } from 'src/filter/ActionFilter';
import { Action } from '../action/Action';
import { ApiError } from './ApiError';
import { ApiResponse } from './ApiResponse';
export declare type ApiRequestJSON = {
    api?: string;
    resource: string;
    action: string;
    params?: Record<string, unknown>;
    filters?: BagEntries<ActionFilterValueType>;
    fields?: Record<string, unknown>;
    data?: Record<string, unknown>;
};
export declare class ApiRequest {
    private _action;
    private _fields;
    private _params;
    private _filters;
    private _data;
    constructor(json?: ApiRequestJSON);
    action(action: Action): ApiRequest;
    getAction(): Action;
    params(params: Record<string, unknown>): ApiRequest;
    addParam(name: string, value: unknown): ApiRequest;
    addParams(params: Record<string, unknown>): ApiRequest;
    getParams(): Record<string, unknown>;
    fields(fields: Record<string, unknown>): ApiRequest;
    addField(name: string, value: unknown): ApiRequest;
    getFields(): Record<string, unknown>;
    filters(filters: BagEntries<ActionFilterValueType>): ApiRequest;
    addFilter(name: string, value: ActionFilterValueType): ApiRequest;
    addFilters(filters: BagEntries<ActionFilterValueType>): ApiRequest;
    getFilters(): BagEntries<ActionFilterValueType>;
    data(data: Record<string, unknown>): ApiRequest;
    send(): Promise<ApiResponse | ApiError>;
    protected serialize(): object;
}
//# sourceMappingURL=ApiRequest.d.ts.map