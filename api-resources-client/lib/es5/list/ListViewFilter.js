export class ListViewFilter {
    constructor(filter, model) {
        this._value = null;
        this._filter = filter;
        this._model = model;
    }
    get name() {
        return this._filter.name;
    }
    get filter() {
        return this._filter;
    }
    get defaultValue() {
        return this._filter.defaultValue;
    }
    hasDefaultValueSet() {
        return JSON.stringify(this._value) === JSON.stringify(this.defaultValue);
    }
    get nullIsOption() {
        return this._filter.nullIsOption;
    }
    get allIsOption() {
        return this._filter.allIsOption;
    }
    get noneIsOption() {
        return this._filter.noneIsOption;
    }
    hasOptions() {
        return this._filter.hasOptions();
    }
    get options() {
        return this._filter.options;
    }
    hasOptionsRequest() {
        return this._filter.hasOptionsRequest();
    }
    createOptionsRequest() {
        return this._filter.createOptionsRequest();
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this.setInternalValue(value, true);
    }
    setInternalValue(value, dispatchChange = false) {
        const newJson = JSON.stringify(value);
        const oldJson = JSON.stringify(this._value);
        if (newJson !== oldJson) {
            this._value = value;
            if (dispatchChange) {
                this._model.filterValueChanged(this.name);
            }
            return true;
        }
        return false;
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
    serialize() {
        if (!this.hasDefaultValueSet()) { // send only if no default
            let useFilter = true;
            if (this._value === null) { // send null only if it's an option
                useFilter = this.nullIsOption;
            }
            if (useFilter) {
                return this.serializeValue(this._value);
            }
        }
        return undefined;
    }
    /**
     * Serializes a filter value into a stringified query value
     */
    valueToQuery(value) {
        return this._filter.valueToQuery(value);
    }
    /**
     * Converts a stringified query value into a valid filter value
     */
    queryToValue(value) {
        return this._filter.queryToValue(value);
    }
    /**
     * Converts a filter value into a serialized form to be used in api requests
     */
    serializeValue(value) {
        return this._filter.serializeValue(value);
    }
}
