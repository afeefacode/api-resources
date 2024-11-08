import { Action } from '../action/Action';
import { ActionFilter, ActionFilterJSON, ActionFilterValueType } from './ActionFilter';
export declare class Filter {
    get type(): string;
    createActionFilter(action: Action, name: string, json: ActionFilterJSON): ActionFilter;
    /**
     * Serializes a filter value into a stringified query value
     */
    valueToQuery(_value: ActionFilterValueType): string | undefined;
    /**
     * Converts a stringified query value into a valid filter value
     */
    queryToValue(_value: string): ActionFilterValueType | undefined;
    /**
     * Converts a filter value into a serialized form to be used in api requests
     */
    serializeValue(value: ActionFilterValueType): ActionFilterValueType;
    /**
     * Converts a given default value into a filter value
     * E.g.: 2024-11-07T23:00:00.000000Z -> Date
     */
    deserializeDefaultValue(value: ActionFilterValueType): ActionFilterValueType;
}
//# sourceMappingURL=Filter.d.ts.map