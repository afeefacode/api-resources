import { ApiRequest } from '../api/ApiRequest';
import { BagEntries } from '../bag/Bag';
import { ActionFilter, ActionFilterValueType } from '../filter/ActionFilter';
import { ListViewModel } from './ListViewModel';
export declare class ListViewFilter {
    private _filter;
    private _model;
    private _value;
    constructor(filter: ActionFilter, model: ListViewModel);
    get name(): string;
    get filter(): ActionFilter;
    hasDefaultValue(): boolean;
    get defaultValue(): ActionFilterValueType;
    hasDefaultValueSet(): boolean;
    hasOptions(): boolean;
    get options(): unknown[];
    hasOptionsRequest(): boolean;
    createOptionsRequest(): ApiRequest | null;
    get value(): ActionFilterValueType;
    set value(value: ActionFilterValueType);
    setInternalValue(value: ActionFilterValueType, dispatchChange?: boolean): boolean;
    toQuerySource(): BagEntries<string>;
    reset(): boolean;
    serialize(): ActionFilterValueType | undefined;
    /**
     * Serializes a filter value into a stringified query value
     */
    valueToQuery(value: ActionFilterValueType): string | undefined;
    /**
     * Converts a stringified query value into a valid filter value
     */
    queryToValue(value: string): ActionFilterValueType | undefined;
    /**
     * Converts a filter value into a serialized form to be used in api requests
     */
    serializeValue(value: ActionFilterValueType): ActionFilterValueType;
    /**
     * Converts a given serialized value into a filter value
     * E.g.: 2024-11-07T23:00:00.000000Z -> Date
     */
    deserializeDefaultValue(value: ActionFilterValueType): ActionFilterValueType;
}
//# sourceMappingURL=ListViewFilter.d.ts.map