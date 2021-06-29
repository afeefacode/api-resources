import { ApiRequest } from '../api/ApiRequest';
export class Filter {
    constructor(requestFilters) {
        this.options = [];
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
    get request() {
        return this._request;
    }
    createActionFilter(action, name, json) {
        const filter = new this.constructor();
        let requestFactory = null;
        if (json.optionsRequest) {
            requestFactory = () => {
                const requestAction = action.getApi().getAction(json.optionsRequest.resource, json.optionsRequest.action);
                return new ApiRequest(json.optionsRequest)
                    .action(requestAction);
            };
        }
        filter.init(action, name, json.default || null, json.options, requestFactory);
        return filter;
    }
    createRequestFilter(requestFilters) {
        const filter = new this.constructor(requestFilters);
        filter.init(this._action, this.name, this._defaultValue, this.options, this._requestFactory);
        if (filter._requestFactory) {
            filter._request = filter._requestFactory();
        }
        filter.reset();
        return filter;
    }
    initFromUsed(usedFilters) {
        const usedFilter = usedFilters[this.name];
        if (usedFilter) {
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
        if (!this.hasDefaultValue()) {
            const valueString = this.valueToQuery(this._value);
            if (valueString) {
                return {
                    [this.name]: valueString
                };
            }
        }
        return {};
    }
    hasDefaultValue() {
        return JSON.stringify(this._value) === JSON.stringify(this._defaultValue);
    }
    reset() {
        if (!this.hasDefaultValue()) {
            this._value = this._defaultValue;
            return true;
        }
        return false;
    }
    serialize() {
        if (!this.hasDefaultValue()) {
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
    init(action, name, defaultValue, options = [], _requestFactory) {
        this._action = action;
        this.name = name;
        this._defaultValue = defaultValue;
        this.options = options;
        this._requestFactory = _requestFactory;
    }
}
