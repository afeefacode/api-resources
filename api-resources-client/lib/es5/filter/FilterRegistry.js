class FilterRegistry {
    constructor() {
        this._filters = {};
    }
    register(type, FilterClass) {
        this._filters[type] = FilterClass;
    }
    get(type) {
        return this._filters[type] || null;
    }
}
export const filterRegistry = new FilterRegistry();
export function registerFilter(type, FilterClass) {
    return filterRegistry.register(type, FilterClass);
}
export function getFilter(type) {
    return filterRegistry.get(type);
}
