import { BagEntries } from 'src/bag/Bag';
import { Filter, FilterValueType } from '../filter/Filter';
import { ListViewModel } from './ListViewModel';
export declare class ListViewFilter {
    private _filter;
    private _model;
    private _value;
    constructor(filter: Filter, model: ListViewModel);
    get name(): string;
    get defaultValue(): FilterValueType;
    hasDefaultValueSet(): boolean;
    get value(): FilterValueType;
    set value(value: FilterValueType);
    initFromQuerySource(query: BagEntries<string>): void;
    toQuerySource(): BagEntries<string>;
    reset(): boolean;
    /**
     * Serializes a filter value into a stringified query value
     */
    protected valueToQuery(_value: FilterValueType): string | undefined;
    /**
     * Converts a stringified query value into a valid filter value
     */
    protected queryToValue(_value: string): FilterValueType | undefined;
    /**
     * Converts a filter value into a serialized form to be used in api requests
     */
    protected serializeValue(value: FilterValueType): FilterValueType;
}
//# sourceMappingURL=ListViewFilter.d.ts.map