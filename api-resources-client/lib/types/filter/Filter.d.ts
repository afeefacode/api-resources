import { Query } from './BaseQuerySource';
import { RequestFilters } from './RequestFilters';
export declare type FilterJSON = {
    type: string;
    params: FilterParams;
    default: unknown;
};
export declare type FilterParams = {};
export declare class Filter {
    [key: string]: any;
    type: string;
    name: string;
    params: unknown;
    defaultValue: unknown;
    value: unknown;
    private _valueInitialized;
    private _requestFilters;
    constructor(requestFilters?: RequestFilters);
    createActionFilter(name: string, json: FilterJSON): Filter;
    createRequestFilter(requestFilters: RequestFilters): Filter;
    initFromUsed(usedFilters: Query): void;
    initFromQuerySource(query: Query): void;
    protected fromQuerySource(query: Query): void;
    toUrlParams(): Query;
    toQuerySource(): Query;
    reset(): void;
    serialize(): Query;
    protected init(name: string, defaultValue: unknown, params: unknown): void;
    protected createValueProxy(defaultValue: object): object;
    protected valueChanged(key: string, value: unknown): void;
}
//# sourceMappingURL=Filter.d.ts.map