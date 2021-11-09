import { ApiRequest } from '../api/ApiRequest';
export class Filter {
    constructor() {
        this._defaultValue = null;
        this._nullIsOption = false;
        this._options = [];
        this._requestFactory = null;
        this.type = this.constructor.type;
    }
    getAction() {
        return this._action;
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
    hasRequest() {
        return !!this._requestFactory;
    }
    get request() {
        if (this._requestFactory) {
            return this._requestFactory();
        }
        return null;
    }
    createActionFilter(action, name, json) {
        const filter = new this.constructor();
        let requestFactory = null;
        if (json.options_request) {
            requestFactory = () => {
                const requestAction = action.getApi().getAction(json.options_request.resource, json.options_request.action);
                return new ApiRequest(json.options_request)
                    .action(requestAction);
            };
        }
        filter.init(action, name, json.default || null, json.options || [], json.null_is_option || false, requestFactory);
        return filter;
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
    init(action, name, defaultValue, options, nullIsOption, _requestFactory) {
        this._action = action;
        this.name = name;
        this._defaultValue = defaultValue;
        this._options = options;
        this._nullIsOption = nullIsOption;
        this._requestFactory = _requestFactory;
    }
}
