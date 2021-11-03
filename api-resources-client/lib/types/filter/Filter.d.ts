import { Action } from '../action/Action';
import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest';
import { BagEntries } from '../bag/Bag';
import { RequestFilters } from './RequestFilters';
export declare type FilterValueType = (boolean | string | number | null | Record<string, boolean | string | number | null>);
export declare type FilterJSON = {
    type: string;
    default: FilterValueType;
    options: [];
    options_request: ApiRequestJSON;
    null_is_option: boolean;
};
export declare type FilterParams = object;
declare type RequestFactory = (() => ApiRequest) | null;
export declare class Filter {
    type: string;
    name: string;
    private _action;
    private _defaultValue;
    private _nullIsOption;
    private _value;
    private _options;
    private _requestFactory;
    private _request;
    private _requestFilters;
    constructor(requestFilters?: RequestFilters);
    getAction(): Action;
    get value(): FilterValueType;
    /**
     * Sets the filter value and dispatches a change event
     */
    set value(value: FilterValueType);
    get defaultValue(): FilterValueType;
    hasOptions(): boolean;
    hasOption(value: unknown): boolean;
    get options(): unknown[];
    get nullIsOption(): boolean;
    hasRequest(): boolean;
    get request(): ApiRequest | null;
    createActionFilter(action: Action, name: string, json: FilterJSON): Filter;
    createRequestFilter(requestFilters: RequestFilters): Filter;
    initFromUsed(usedFilters: BagEntries<FilterValueType>): void;
    initFromQuerySource(query: BagEntries<string>): void;
    toQuerySource(): BagEntries<string>;
    hasDefaultValueSet(): boolean;
    reset(): boolean;
    serialize(): BagEntries<FilterValueType>;
    /**
     * Serializes a filter value into a stringified query value
     */
    valueToQuery(_value: FilterValueType): string | undefined;
    /**
     * Converts a stringified query value into a valid filter value
     */
    queryToValue(_value: string): FilterValueType | undefined;
    /**
     * Converts a filter value into a serialized form to be used in api requests
     */
    serializeValue(value: FilterValueType): FilterValueType;
    protected init(action: Action, name: string, defaultValue: FilterValueType, options: unknown[], nullIsOption: boolean, _requestFactory: RequestFactory): void;
}
export {};
//# sourceMappingURL=Filter.d.ts.map