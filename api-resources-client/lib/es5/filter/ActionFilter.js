import { ApiRequest } from '../api/ApiRequest';
export class ActionFilter {
    constructor(action, filter, name, json) {
        this._defaultValue = null;
        this._options = [];
        this._requestFactory = null;
        this._filter = filter;
        this._name = name;
        this._defaultValue = json.default || null;
        this._hasDefaultValue = json.hasOwnProperty('default');
        this._options = json.options || [];
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
    valueToQuery(value) {
        return this._filter.valueToQuery(value);
    }
    queryToValue(value) {
        return this._filter.queryToValue(value);
    }
    serializeValue(value) {
        return value;
    }
}
