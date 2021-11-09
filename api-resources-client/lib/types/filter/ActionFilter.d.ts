import { Action } from '../action/Action';
import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest';
import { Filter } from './Filter';
export declare type ActionFilterValueType = (boolean | string | number | null | Record<string, boolean | string | number | null>);
export declare type ActionFilterJSON = {
    type: string;
    default: ActionFilterValueType;
    options: [];
    options_request: ApiRequestJSON;
    null_is_option: boolean;
};
export declare class ActionFilter {
    private _filter;
    private _name;
    private _defaultValue;
    private _nullIsOption;
    private _options;
    private _requestFactory;
    constructor(action: Action, filter: Filter, name: string, json: ActionFilterJSON);
    get type(): string;
    get name(): string;
    get defaultValue(): ActionFilterValueType;
    hasOptions(): boolean;
    hasOption(value: unknown): boolean;
    get options(): unknown[];
    get nullIsOption(): boolean;
    hasOptionsRequest(): boolean;
    createOptionsRequest(): ApiRequest | null;
    valueToQuery(value: ActionFilterValueType): string | undefined;
    queryToValue(value: string): ActionFilterValueType | undefined;
    serializeValue(value: ActionFilterValueType): ActionFilterValueType;
}
//# sourceMappingURL=ActionFilter.d.ts.map