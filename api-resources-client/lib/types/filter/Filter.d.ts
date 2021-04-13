import { QuerySource } from './BaseQuerySource';
import { RequestFilters } from './RequestFilters';
export declare type FilterJSON = {
    type: string;
    params: FilterParams;
    default: FilterValue;
};
export declare type FilterParams = object;
export declare type FilterValue = boolean | string | number | null | FilterValues;
export declare type FilterValues = {
    [key: string]: FilterValue;
};
export declare class Filter {
    [key: string]: any;
    type: string;
    name: string;
    params: unknown;
    defaultValue: FilterValue;
    value: FilterValue;
    private _valueInitialized;
    private _requestFilters;
    constructor(requestFilters?: RequestFilters);
    createActionFilter(name: string, json: FilterJSON): Filter;
    createRequestFilter(requestFilters: RequestFilters): Filter;
    initFromUsed(usedFilters: FilterValues): void;
    initFromQuerySource(query: QuerySource): void;
    toUrlParams(): QuerySource;
    toQuerySource(): QuerySource;
    reset(): void;
    serialize(): FilterValues;
    protected fromQuerySource(query: QuerySource): void;
    protected filterValueToString(value: FilterValue): string | null;
    protected init(name: string, defaultValue: FilterValue, params: unknown): void;
    protected createValueProxy(defaultValue: FilterValue): FilterValue;
    protected valueChanged(_key: string, _value: unknown): void;
}
//# sourceMappingURL=Filter.d.ts.map