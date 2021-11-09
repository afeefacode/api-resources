import { Action } from '../action/Action';
import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest';
export declare type FilterValueType = (boolean | string | number | null | Record<string, boolean | string | number | null>);
export declare type FilterJSON = {
    type: string;
    default: FilterValueType;
    options: [];
    options_request: ApiRequestJSON;
    null_is_option: boolean;
};
export declare type FilterParams = object;
export declare class Filter {
    type: string;
    name: string;
    private _defaultValue;
    private _nullIsOption;
    private _options;
    private _requestFactory;
    constructor();
    get defaultValue(): FilterValueType;
    hasOptions(): boolean;
    hasOption(value: unknown): boolean;
    get options(): unknown[];
    get nullIsOption(): boolean;
    hasOptionsRequest(): boolean;
    createOptionsRequest(): ApiRequest | null;
    createActionFilter(action: Action, name: string, json: FilterJSON): Filter;
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
}
//# sourceMappingURL=Filter%20copy.d.ts.map