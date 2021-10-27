import { ApiRequest } from '../api/ApiRequest';
export class Filter {
    constructor(requestFilters) {
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
        return !!this._options;
    }
    get options() {
        return this._options;
    }
    get allowNull() {
        return this._allowNull;
    }
    hasRequest() {
        return !!this._request;
    }
    get request() {
        return this._request;
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
        filter.init(action, name, json.default || null, json.options, json.allow_null || false, requestFactory);
        return filter;
    }
    createRequestFilter(requestFilters) {
        const filter = new this.constructor(requestFilters);
        filter.init(this._action, this.name, this._defaultValue, this._options, this._allowNull, this._requestFactory);
        if (filter._requestFactory) {
            filter._request = filter._requestFactory();
        }
        filter.reset();
        return filter;
    }
    initFromUsed(usedFilters) {
        const usedFilter = usedFilters[this.name];
        if (usedFilter !== undefined) {
            this.value = usedFilter;
        }
    }
    initFromQuerySource(query) {
        const queryValue = query[this.name];
        if (queryValue) {
            this._value = this.queryToValue(queryValue);
        }
        else {
            this.reset();
        }
    }
    toQuerySource() {
        if (!this.hasDefaultValueSet()) {
            const valueString = this.valueToQuery(this._value);
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
        if (!this.hasDefaultValueSet()) {
            const serialized = this.serializeValue(this._value);
            if (serialized !== undefined) {
                return {
                    [this.name]: this._value
                };
            }
        }
        return {};
    }
    valueToQuery(_value) {
        return undefined;
    }
    queryToValue(_value) {
        return undefined;
    }
    serializeValue(value) {
        return value;
    }
    init(action, name, defaultValue, options = [], allowNull, _requestFactory) {
        this._action = action;
        this.name = name;
        this._defaultValue = defaultValue;
        this._options = options;
        this._allowNull = allowNull;
        this._requestFactory = _requestFactory;
    }
}
