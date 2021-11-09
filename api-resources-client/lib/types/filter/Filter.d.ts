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
}
//# sourceMappingURL=Filter.d.ts.map