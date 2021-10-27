import { RequestFilters } from 'src';
import { Filter } from './Filter';
import { UsedFilters } from './RequestFilters';
export declare type FilterValueType = boolean | string | number | [string, FilterValueType] | null;
export declare class RequestFilter {
    private _requestFilters;
    private _filter;
    private _value;
    constructor(requestFilters: RequestFilters, filter: Filter);
    get value(): FilterValueType;
    set value(value: FilterValueType);
    hasDefaultValueSet(): boolean;
    reset(): boolean;
    serialize(): UsedFilters;
    protected valueToQuery(_value: unknown): string | undefined;
    protected queryToValue(_value: string): unknown | undefined;
    protected serializeValue(value: unknown): unknown | undefined;
}
//# sourceMappingURL=RequestFilter%20copy.d.ts.map