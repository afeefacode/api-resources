export class ListViewFilter {
    constructor(filter, model) {
        this._value = null;
        this._filter = filter;
        this._model = model;
    }
    get name() {
        return this._filter.name;
    }
    get defaultValue() {
        return this._filter.defaultValue;
    }
    hasDefaultValueSet() {
        return this._filter.hasDefaultValueSet();
    }
    get value() {
        return this._value;
    }
    set value(value) {
        if (value !== this._value) {
            this._value = value;
            this._model.filterValueChanged();
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
    reset() {
        if (!this.hasDefaultValueSet()) {
            this._value = this.defaultValue;
            return true;
        }
        return false;
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
