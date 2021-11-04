import { ApiRequest } from '../api/ApiRequest';
import { BagEntries } from '../bag/Bag';
import { Filter, FilterValueType } from '../filter/Filter';
import { ListViewModel } from './ListViewModel';
export declare class ListViewFilter {
    private _filter;
    private _model;
    private _value;
    constructor(filter: Filter, model: ListViewModel);
    get name(): string;
    get filter(): Filter;
    get defaultValue(): FilterValueType;
    hasDefaultValueSet(): boolean;
    get nullIsOption(): boolean;
    hasOptions(): boolean;
    get options(): unknown[];
    hasRequest(): boolean;
    get request(): ApiRequest | null;
    get value(): FilterValueType;
    set value(value: FilterValueType);
    setInternalValue(value: FilterValueType, dispatchChange?: boolean): boolean;
    toQuerySource(): BagEntries<string>;
    reset(): boolean;
    serialize(): FilterValueType | undefined;
    /**
     * Serializes a filter value into a stringified query value
     */
    valueToQuery(value: FilterValueType): string | undefined;
    /**
     * Converts a stringified query value into a valid filter value
     */
    queryToValue(value: string): FilterValueType | undefined;
    /**
     * Converts a filter value into a serialized form to be used in api requests
     */
    serializeValue(value: FilterValueType): FilterValueType;
}
//# sourceMappingURL=ListViewFilter.d.ts.map