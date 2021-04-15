export class Filter {
    constructor(requestFilters) {
        this.options = [];
        this.type = this.constructor.type;
        if (requestFilters) {
            this._requestFilters = requestFilters;
        }
    }
    get value() {
        return this._value;
    }
    set value(value) {
        if (value !== this._value) {
            this._value = value;
            this._requestFilters.valueChanged(this);
        }
    }
    createActionFilter(name, json) {
        const filter = new this.constructor();
        filter.init(name, json.default || null, json.options);
        return filter;
    }
    createRequestFilter(requestFilters) {
        const filter = new this.constructor(requestFilters);
        filter.init(this.name, this._defaultValue, this.options);
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
        if (this._value !== this._defaultValue) {
            const valueString = this.valueToQuery(this._value);
            if (valueString) {
                return {
                    [this.name]: valueString
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
    reset() {
        this._value = this._defaultValue;
    }
    serialize() {
        if (this._value !== this._defaultValue) {
            const serialized = this.serializeValue(this._value);
            if (serialized !== undefined) {
                return {
                    [this.name]: this._value
                };
            }
        }
        return {};
    }
    serializeValue(value) {
        return value;
    }
    init(name, defaultValue, options = []) {
        this.name = name;
        this._defaultValue = defaultValue;
        this.options = options;
    }
}
