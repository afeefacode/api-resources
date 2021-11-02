import { filterHistory } from '../filter/FilterHistory';
import { FilterBag } from './FilterBag';
import { FilterChangeEvent } from './FilterChangeEvent';
import { PageFilter } from './filters/PageFilter';
import { ObjectFilterSource } from './ObjectFilterSource';
/**
 * Request filters do have multiple change entry points:
 * - create: read existing query string and init filter values -> consumer should initially -> LOAD
 * - get from history: consumer should initially -> LOAD
 * - click: update filter values and update query string  -> RELOAD
 * - query changed: update filter values -> RELOAD
 * - init used filters: update filter values and update query string
 */
export class RequestFilters {
    constructor(filters, historyKey, filterSource) {
        this._filters = new FilterBag();
        this._lastQuery = {};
        this._eventTarget = new EventTarget();
        this._historyKey = historyKey;
        this._filterSource = filterSource || new ObjectFilterSource({});
        for (const [name, filter] of filters.entries()) {
            this._filters.add(name, filter.createRequestFilter(this));
        }
        this.initFromQuerySource();
    }
    static create(filters, historyKey, filterSource) {
        let requestFilters;
        filterSource = filterSource || new ObjectFilterSource({});
        if (historyKey) {
            if (filterHistory.hasFilters(historyKey)) {
                requestFilters = filterHistory.getFilters(historyKey);
            }
            else {
                requestFilters = new RequestFilters(filters, historyKey, filterSource);
                filterHistory.addFilters(historyKey, requestFilters);
            }
        }
        else {
            requestFilters = new RequestFilters(filters, undefined, filterSource);
        }
        return requestFilters;
    }
    static fromHistory(historyKey) {
        if (filterHistory.hasFilters(historyKey)) {
            return filterHistory.getFilters(historyKey);
        }
        else {
            return null;
        }
    }
    on(type, handler) {
        this._eventTarget.addEventListener(type, handler);
    }
    off(type, handler) {
        this._eventTarget.removeEventListener(type, handler);
    }
    getFilters() {
        return this._filters.getEntries();
    }
    initFromUsed(usedFilters, count) {
        // reset filter values
        this._filters.values().forEach(f => f.initFromUsed(usedFilters));
        // push to query source here since updates are disabled in valueChanged()
        this.pushToQuerySource();
        if (this._historyKey && !count) {
            filterHistory.removeFilters(this._historyKey);
        }
    }
    filterSourceChanged() {
        const query = this._filterSource.getQuery();
        if (JSON.stringify(this._lastQuery) === JSON.stringify(query)) {
            return;
        }
        this.initFromQuerySource();
        this.dispatchUpdate();
    }
    valueChanged(filters) {
        // reset page filter if any other filter changes
        if (!Object.values(filters).find(f => f instanceof PageFilter)) {
            const pageFilter = this._filters.values().find(f => f instanceof PageFilter);
            if (pageFilter) {
                pageFilter.reset();
            }
        }
        this.pushToQuerySource();
        this.dispatchUpdate();
    }
    reset() {
        const changedFilters = {};
        this._filters.values().forEach(f => {
            const changed = f.reset();
            if (changed) {
                changedFilters[f.name] = f;
            }
        });
        this.pushToQuerySource();
        this.valueChanged(changedFilters);
    }
    serialize(options = {}) {
        return this._filters.values()
            .reduce((map, filter) => {
            return Object.assign(Object.assign({}, map), filter.serialize() // returns {} if not set
            );
        }, options);
    }
    dispatchUpdate() {
        this._eventTarget.dispatchEvent(new FilterChangeEvent('change', {}));
    }
    initFromQuerySource() {
        const query = this._filterSource.getQuery();
        for (const filter of this._filters.values()) {
            filter.initFromQuerySource(query);
        }
        this._lastQuery = query;
    }
    pushToQuerySource() {
        const query = this._filters.values().reduce((map, filter) => {
            return Object.assign(Object.assign({}, map), filter.toQuerySource());
        }, {});
        this._filterSource.push(query);
        this._lastQuery = query;
    }
}
