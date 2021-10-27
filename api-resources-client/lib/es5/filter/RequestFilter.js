export class RequestFilter {
    constructor(requestFilters, filter) {
        this._requestFilters = requestFilters;
        this._filter = filter;
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
    hasDefaultValueSet() {
        return JSON.stringify(this._value) === JSON.stringify(this._filter.defaultValue);
    }
    reset() {
        if (!this.hasDefaultValueSet()) {
            this._value = this._filter.defaultValue;
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
}
