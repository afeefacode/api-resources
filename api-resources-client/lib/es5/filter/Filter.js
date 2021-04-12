export class Filter {
    constructor(requestFilters) {
        this._valueInitialized = false;
        this.type = this.constructor.type;
        // console.log('--REG--', this.type, this.constructor.name)
        if (requestFilters) {
            this._requestFilters = requestFilters;
            return new Proxy(this, {
                get: function (filter, key) {
                    return filter[key];
                },
                set: function (filter, key, value) {
                    // ignore setting initial value in constructor where
                    // name is not present yet
                    if (filter._valueInitialized && key === 'value') {
                        const oldJson = filter.serialize();
                        // console.log('setFilterValue1', filter.constructor.name, filter.name, key, value, filter.value, filter[key])
                        filter[key] = value;
                        const newJson = filter.serialize();
                        if (JSON.stringify(newJson) !== JSON.stringify(oldJson)) {
                            // console.log('setFilterValue', filter.constructor.name, filter.name, key, value)
                            // console.log(JSON.stringify(oldJson), JSON.stringify(newJson))
                            filter.valueChanged(key, value);
                        }
                    }
                    else {
                        filter[key] = value;
                    }
                    return true;
                }
            });
        }
    }
    createActionFilter(name, json) {
        const filter = new this.constructor();
        filter.init(name, json.default, json.params);
        return filter;
    }
    createRequestFilter(requestFilters) {
        const filter = new this.constructor(requestFilters);
        filter.init(this.name, this.defaultValue, this.params);
        filter.reset();
        return filter;
    }
    initFromUsed(usedFilters) {
        if (usedFilters[this.name]) {
            if (this.defaultValue && typeof this.defaultValue === 'object') {
                for (const [key, value] of Object.entries(usedFilters[this.name])) {
                    this.value[key] = value;
                }
            }
            else {
                this.value = usedFilters[this.name];
            }
        }
    }
    initFromQuerySource(query) {
        if (query[this.name]) {
            this.fromQuerySource(query);
        }
        else {
            this.reset();
        }
    }
    fromQuerySource(query) {
        this.value = query[this.name];
    }
    toUrlParams() {
        return this.toQuerySource();
    }
    toQuerySource() {
        if (this.value) {
            return {
                [this.name]: this.value
            };
        }
        return {};
    }
    reset() {
        if (this.defaultValue && typeof this.defaultValue === 'object') {
            this.value = this.createValueProxy(this.defaultValue);
        }
        else {
            this.value = this.defaultValue;
        }
        this._valueInitialized = true;
    }
    serialize() {
        if (this.value) {
            return {
                [this.name]: this.value
            };
        }
        return {};
    }
    init(name, defaultValue, params) {
        this.name = name;
        this.defaultValue = defaultValue;
        this.params = params;
    }
    createValueProxy(defaultValue) {
        const value = new Proxy(Object.assign({}, defaultValue), {
            get: function (object, key) {
                return object[key];
            },
            set: (object, key, value) => {
                // console.log('setFilterValueProp', this.constructor.name, this.name, key, value)
                if (value !== object[key]) {
                    // console.log('setFilterValueProp', this.constructor.name, this.name, key, value)
                    object[key] = value;
                    this.valueChanged(key, object);
                }
                return true;
            }
        });
        return value;
    }
    valueChanged(key, value) {
        // console.log('--- value changed', this.constructor.name, this.name, key, value)
        this._requestFilters.valueChanged(this);
    }
}
