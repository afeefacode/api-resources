import { ApiRequest } from '../api/ApiRequest';
export class ActionFilter {
    constructor(action, filter, name, json) {
        this._defaultValue = null;
        this._options = [];
        this._multiple = false;
        this._requestFactory = null;
        this._filter = filter;
        this._name = name;
        this._multiple = !!json.multiple;
        this._options = json.options || [];
        this._hasDefaultValue = json.hasOwnProperty('default');
        const empty = this._multiple ? [] : null;
        this._defaultValue = filter.deserializeDefaultValue(json.default || empty);
        if (json.options_request) {
            this._requestFactory = () => {
                const requestAction = action.getApi().getAction(json.options_request.resource, json.options_request.action);
                return new ApiRequest(json.options_request)
                    .action(requestAction);
            };
        }
    }
    get type() {
        return this._filter.type;
    }
    get name() {
        return this._name;
    }
    hasDefaultValue() {
        return this._hasDefaultValue;
    }
    get defaultValue() {
        return this._defaultValue;
    }
    hasOptions() {
        return !!this._options.length;
    }
    hasOption(value) {
        return this._options.some(o => o.value === value);
    }
    get options() {
        return this._options;
    }
    hasOptionsRequest() {
        return !!this._requestFactory;
    }
    createOptionsRequest() {
        if (this._requestFactory) {
            return this._requestFactory();
        }
        return null;
    }
    get multiple() {
        return this._multiple;
    }
    valueToQuery(value) {
        return this._filter.valueToQuery(value);
    }
    queryToValue(value) {
        return this._filter.queryToValue(value);
    }
    serializeValue(value) {
        return this._filter.serializeValue(value);
    }
    deserializeDefaultValue(value) {
        return this._filter.deserializeDefaultValue(value);
    }
}
