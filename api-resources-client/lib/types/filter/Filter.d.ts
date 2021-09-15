import { Action } from '../action/Action';
import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest';
import { QuerySource } from './BaseFilterSource';
import { RequestFilters, UsedFilters } from './RequestFilters';
export declare type FilterValueType = boolean | string | number | [string, FilterValueType] | null;
export declare type FilterJSON = {
    type: string;
    default: FilterValueType;
    options: [];
    optionsRequest: ApiRequestJSON;
};
export declare type FilterParams = object;
declare type RequestFactory = (() => ApiRequest) | null;
export declare class Filter {
    type: string;
    name: string;
    private _action;
    private _defaultValue;
    private _value;
    options: unknown[];
    private _requestFactory;
    private _request;
    private _requestFilters;
    constructor(requestFilters?: RequestFilters);
    getAction(): Action;
    get value(): FilterValueType;
    set value(value: FilterValueType);
    get defaultValue(): FilterValueType;
    get request(): ApiRequest | null;
    createActionFilter(action: Action, name: string, json: FilterJSON): Filter;
    createRequestFilter(requestFilters: RequestFilters): Filter;
    initFromUsed(usedFilters: UsedFilters): void;
    initFromQuerySource(query: QuerySource): void;
    toQuerySource(): QuerySource;
    hasDefaultValueSet(): boolean;
    reset(): boolean;
    serialize(): UsedFilters;
    protected valueToQuery(_value: unknown): string | undefined;
    protected queryToValue(_value: string): unknown | undefined;
    protected serializeValue(value: unknown): unknown | undefined;
    protected init(action: Action, name: string, defaultValue: FilterValueType, options: unknown[] | undefined, _requestFactory: RequestFactory): void;
}
export {};
//# sourceMappingURL=Filter.d.ts.map