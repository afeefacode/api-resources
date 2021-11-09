import { ApiRequest } from '../api/ApiRequest';
export class ActionFilter {
    constructor(action, filter, name, json) {
        this._defaultValue = null;
        this._nullIsOption = false;
        this._options = [];
        this._requestFactory = null;
        this._filter = filter;
        this._name = name;
        this._defaultValue = json.default || null;
        this._options = json.options || [];
        this._nullIsOption = json.null_is_option || false;
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
    get defaultValue() {
        return this._defaultValue;
    }
    hasOptions() {
        return !!this._options.length;
    }
    hasOption(value) {
        return this._options.includes(value);
    }
    get options() {
        return this._options;
    }
    get nullIsOption() {
        return this._nullIsOption;
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
