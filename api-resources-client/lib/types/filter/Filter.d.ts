import { QuerySource } from './BaseQuerySource';
import { RequestFilters } from './RequestFilters';
export declare type FilterValueType = boolean | string | number | [string, FilterValueType] | null;
export declare type FilterJSON = {
    type: string;
    default: FilterValueType;
    options: [];
};
export declare type FilterParams = object;
export declare class Filter {
    type: string;
    name: string;
    private _defaultValue;
    private _value;
    options: unknown[];
    private _requestFilters;
    constructor(requestFilters?: RequestFilters);
    get value(): FilterValueType;
    set value(value: FilterValueType);
    createActionFilter(name: string, json: FilterJSON): Filter;
    createRequestFilter(requestFilters: RequestFilters): Filter;
    initFromUsed(usedFilters: Record<string, FilterValueType>): void;
    initFromQuerySource(query: QuerySource): void;
    toQuerySource(): QuerySource;
    protected valueToQuery(_value: unknown): string | undefined;
    protected queryToValue(_value: string): unknown | undefined;
    reset(): void;
    serialize(): Record<string, FilterValueType>;
    protected serializeValue(value: unknown): unknown | undefined;
    protected init(name: string, defaultValue: FilterValueType, options?: unknown[]): void;
}
//# sourceMappingURL=Filter.d.ts.map