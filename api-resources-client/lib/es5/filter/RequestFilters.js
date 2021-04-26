import { FilterChangeEvent } from './FilterChangeEvent';
import { ObjectQuerySource } from './ObjectQuerySource';
export class RequestFilters {
    constructor(querySource) {
        this._filters = {};
        this._lastQuery = {};
        this._disableUpdates = false;
        this._eventTarget = new EventTarget();
        this._querySource = querySource || new ObjectQuerySource({});
    }
    querySource(querySource) {
        this._querySource = querySource;
    }
    add(name, filter) {
        this._filters[name] = filter;
    }
    getFilters() {
        return this._filters;
    }
    hasFilter(name) {
        return !!this._filters[name];
    }
    getQuerySource() {
        return this._querySource;
    }
    initFromUsed(usedFilters) {
        this._disableUpdates = true;
        Object.values(this._filters).forEach(f => f.initFromUsed(usedFilters));
        this._disableUpdates = false;
        this.pushToQuerySource();
    }
    on(type, handler) {
        this._eventTarget.addEventListener(type, handler);
    }
    off(type, handler) {
        this._eventTarget.removeEventListener(type, handler);
    }
    valueChanged(filters) {
        if (this._disableUpdates) {
            return;
        }
        this._eventTarget.dispatchEvent(new FilterChangeEvent('change', filters));
    }
    initFromQuerySource() {
        const query = this._querySource.getQuery();
        // skip initial filters
        if (JSON.stringify(this._lastQuery) === JSON.stringify(query)) {
            // console.warn('same query')
            // console.log(JSON.stringify(this._lastQuery), JSON.stringify(query))
            return false;
        }
        // console.log(JSON.stringify(this._lastQuery), JSON.stringify(query))
        for (const filter of Object.values(this._filters)) {
            filter.initFromQuerySource(query);
        }
        this._lastQuery = query;
        return true;
    }
    pushToQuerySource() {
        const query = Object.values(this._filters).reduce((map, filter) => {
            return Object.assign(Object.assign({}, map), filter.toQuerySource());
        }, {});
        this._querySource.push(query);
        this._lastQuery = query;
    }
    reset() {
        const changedFilters = {};
        Object.values(this._filters).forEach(f => {
            const changed = f.reset();
            if (changed) {
                changedFilters[f.name] = f;
            }
        });
        this.pushToQuerySource();
        this.valueChanged(changedFilters);
    }
    serialize(options = {}) {
        return Object.values(this._filters).reduce((map, filter) => {
            return Object.assign(Object.assign({}, map), filter.serialize());
        }, options);
    }
}
