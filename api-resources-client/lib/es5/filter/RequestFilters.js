import { filterHistory } from '../filter/FilterHistory';
import { FilterChangeEvent } from './FilterChangeEvent';
import { PageFilter } from './filters/PageFilter';
import { ObjectFilterSource } from './ObjectFilterSource';
/**
 * Request filters do have multiple change entry points:
 * - create: read existing query string and init filter values -> consumer should initially LOAD
 * - get from history: consumer should initially LOAD
 * - click: update filter values and update query string  -> RELOAD
 * - query changed: update filter values -> RELOAD
 * - init used filters: update filter values and update query string
 */
export class RequestFilters {
    constructor(filters, historyKey, querySource) {
        this._filters = {};
        this._lastQuery = {};
        this._disableUpdates = false;
        this._eventTarget = new EventTarget();
        this._historyKey = historyKey;
        this._querySource = querySource || new ObjectFilterSource({});
        for (const [name, filter] of Object.entries(filters)) {
            this._filters[name] = filter.createRequestFilter(this);
        }
        this.initFromQuerySource();
    }
    static create(filters, historyKey, querySource) {
        let requestFilters;
        querySource = querySource || new ObjectFilterSource({});
        if (historyKey) {
            if (filterHistory.hasFilters(historyKey)) {
                requestFilters = filterHistory.getFilters(historyKey);
            }
            else {
                requestFilters = new RequestFilters(filters, historyKey, querySource);
                filterHistory.addFilters(historyKey, requestFilters);
            }
        }
        else {
            requestFilters = new RequestFilters(filters, undefined, querySource);
        }
        return requestFilters;
    }
    on(type, handler) {
        this._eventTarget.addEventListener(type, handler);
    }
    off(type, handler) {
        this._eventTarget.removeEventListener(type, handler);
    }
    getFilters() {
        return this._filters;
    }
    initFromUsed(usedFilters, count) {
        // disable valueChanged() upon f.initFromUsed()
        this._disableUpdates = true;
        Object.values(this._filters).forEach(f => f.initFromUsed(usedFilters));
        this._disableUpdates = false;
        // push to query source here since updates are disabled in valueChanged()
        this.pushToQuerySource();
        if (this._historyKey && !count) {
            filterHistory.removeFilters(this._historyKey);
        }
    }
    querySourceChanged() {
        const query = this._querySource.getQuery();
        if (JSON.stringify(this._lastQuery) === JSON.stringify(query)) {
            return;
        }
        this.initFromQuerySource();
        this.dispatchUpdate();
    }
    valueChanged(filters) {
        // update events are disabled if initialized from used filters
        if (this._disableUpdates) {
            return;
        }
        // reset page filter if any filter changes
        if (!Object.values(filters).find(f => f instanceof PageFilter)) {
            const pageFilter = Object.values(this._filters).find(f => f instanceof PageFilter);
            if (pageFilter) {
                pageFilter.reset();
            }
        }
        this.pushToQuerySource();
        this.dispatchUpdate();
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
    dispatchUpdate() {
        this._eventTarget.dispatchEvent(new FilterChangeEvent('change', {}));
    }
    initFromQuerySource() {
        const query = this._querySource.getQuery();
        for (const filter of Object.values(this._filters)) {
            filter.initFromQuerySource(query);
        }
        this._lastQuery = query;
    }
    pushToQuerySource() {
        const query = Object.values(this._filters).reduce((map, filter) => {
            return Object.assign(Object.assign({}, map), filter.toQuerySource());
        }, {});
        this._querySource.push(query);
        this._lastQuery = query;
    }
}
