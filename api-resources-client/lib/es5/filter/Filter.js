import { ApiRequest } from '../api/ApiRequest';
export class Filter {
    constructor(requestFilters) {
        this._defaultValue = null;
        this._nullIsOption = false;
        this._value = null;
        this._options = [];
        this._requestFactory = null;
        this._request = null;
        this.type = this.constructor.type;
        if (requestFilters) {
            this._requestFilters = requestFilters;
        }
    }
    getAction() {
        return this._action;
    }
    get value() {
        return this._value;
    }
    /**
     * Sets the filter value and dispatches a change event
     */
    set value(value) {
        if (value !== this._value) {
            this._value = value;
            this._requestFilters.valueChanged({
                [this.name]: this
            });
        }
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
    createRequestFilter(requestFilters) {
        const filter = new this.constructor(requestFilters);
        filter.init(this._action, this.name, this._defaultValue, this._options, this._nullIsOption, this._requestFactory);
        if (filter._requestFactory) {
            filter._request = filter._requestFactory();
        }
        filter.reset();
        return filter;
    }
    initFromUsed(usedFilters) {
        const usedFilter = usedFilters[this.name];
        if (usedFilter !== undefined) {
            this._value = usedFilter;
        }
        else {
            this.reset();
        }
    }
    initFromQuerySource(query) {
        const queryValue = query[this.name];
        if (queryValue) { // has query value, typeof === string
            const value = this.queryToValue(queryValue); // query value valid
            if (value !== undefined) {
                this._value = value;
                return;
            }
        }
        this.reset(); // reset to default
    }
    toQuerySource() {
        if (!this.hasDefaultValueSet()) {
            const valueString = this.valueToQuery(this._value); // value can be represented in query
            if (valueString) {
                return {
                    [this.name]: valueString
                };
            }
        }
        return {};
    }
    hasDefaultValueSet() {
        return JSON.stringify(this._value) === JSON.stringify(this._defaultValue);
    }
    reset() {
        if (!this.hasDefaultValueSet()) {
            this._value = this._defaultValue;
            return true;
        }
        return false;
    }
    serialize() {
        if (!this.hasDefaultValueSet()) { // send only if no default
            let useFilter = true;
            if (this._value === null) { // send null only if it's an option
                useFilter = this._nullIsOption;
            }
            if (useFilter) {
                return {
                    [this.name]: this.serializeValue(this._value)
                };
            }
        }
        return {};
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
