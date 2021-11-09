import { ActionFilter } from './ActionFilter';
export class Filter {
    get type() {
        return this.constructor.type;
    }
    createActionFilter(action, name, json) {
        return new ActionFilter(action, this, name, json);
    }
    /**
     * Serializes a filter value into a stringified query value
     */
    valueToQuery(_value) {
        return undefined;
    }
    /**
     * Converts a stringified query value into a valid filter value
     */
    queryToValue(_value) {
        return undefined;
    }
    /**
     * Converts a filter value into a serialized form to be used in api requests
     */
    serializeValue(value) {
        return value;
    }
}
