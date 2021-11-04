import { FilterChangeEvent } from '../filter/FilterChangeEvent';
import { filterHistory } from '../filter/FilterHistory';
import { PageFilter } from '../filter/filters/PageFilter';
import { ListViewFilter } from './ListViewFilter';
import { ListViewFilterBag } from './ListViewFilterBag';
export class ListViewModel {
    constructor(config) {
        this._filterSource = null;
        this._historyKey = null;
        this._filters = new ListViewFilterBag();
        this._eventTarget = new EventTarget();
        this.changedFilters = {};
        this.changedFiltersTimeout = null;
        this._config = config;
        const action = this._config.getAction();
        if (action) {
            for (const [name, filter] of action.getFilters().entries()) {
                this._filters.add(name, new ListViewFilter(filter, this));
            }
        }
    }
    getConfig() {
        return this._config;
    }
    initFilters({ filterSource, historyKey } = {}) {
        this._filterSource = filterSource || null;
        this._historyKey = historyKey || null;
        this.initFilterValues();
        return this;
    }
    getFilterSource() {
        return this._filterSource;
    }
    getHistoryKey() {
        return this._historyKey;
    }
    getFilters() {
        return this._filters;
    }
    saveFiltersInHistory() {
        if (!this._historyKey) {
            console.warn('Can\'t add list view model without history key to history.');
            return this;
        }
        filterHistory.setFilters(this._historyKey, this._filters);
        return this;
    }
    on(type, handler) {
        this._eventTarget.addEventListener(type, handler);
        return this;
    }
    off(type, handler) {
        this._eventTarget.removeEventListener(type, handler);
        return this;
    }
    filterValueChanged(name) {
        // reset page filter if any other filter changes
        if (!(this._filters.get(name).filter instanceof PageFilter)) {
            const pageFilter = this._filters.values().find(f => f.filter instanceof PageFilter);
            if (pageFilter) {
                pageFilter.reset();
            }
        }
        this.changedFilters[name] = this._filters.get(name).value;
        if (this.changedFiltersTimeout) {
            return;
        }
        this.changedFiltersTimeout = setTimeout(() => {
            clearTimeout(this.changedFiltersTimeout);
            this.changedFiltersTimeout = null;
            this.dispatchChange(this.changedFilters);
            this.changedFilters = {};
        }, 10);
    }
    getApiRequest() {
        const action = this._config.getAction();
        if (action) {
            const request = action.createRequest()
                .params(this._config.getParams())
                .fields(this._config.getFields())
                .filters(this._filters.serialize());
            return request;
        }
        return null;
    }
    /**
     * called if the the filter sources has changed and should
     * be reinitialized
     */
    filterSourceChanged() {
        if (!this._filterSource) {
            console.warn('Can\'t notify about changed filter source without setting up a filter source.');
            return;
        }
        const filtersToUse = this.getFiltersFromFilterSource();
        const changedFilters = this.setFilterValues(filtersToUse);
        if (Object.keys(changedFilters).length) {
            this.dispatchChange(changedFilters);
        }
    }
    initFromUsedFilters(usedFilters, count) {
        this.setFilterValues(usedFilters);
        this.pushToQuerySource();
        if (this._historyKey && !count) {
            filterHistory.removeFilters(this._historyKey);
        }
    }
    resetFilters() {
        const changedFilters = {};
        this._filters.values().forEach(f => {
            const changed = f.reset();
            if (changed) {
                changedFilters[f.name] = f.value;
            }
        });
        if (Object.keys(changedFilters).length) {
            this.pushToQuerySource();
            this.dispatchChange(changedFilters);
        }
    }
    dispatchChange(changedFilters) {
        this._eventTarget.dispatchEvent(new FilterChangeEvent('change', changedFilters));
    }
    initFilterValues() {
        let filtersToUse = {};
        // create and init request filters based on the current filter source state
        if (this._filterSource) {
            filtersToUse = this.getFiltersFromFilterSource();
        }
        // no filters based on filter source found, check history
        if (!Object.keys(filtersToUse).length && this._historyKey) {
            // check any already stored filters from a previous request
            filtersToUse = this.getFiltersFromHistory();
        }
        // no source or history filters found, check given filters at last
        if (!Object.keys(filtersToUse).length) {
            filtersToUse = this._config.getFilters();
        }
        this.setFilterValues(filtersToUse);
    }
    setFilterValues(filters) {
        const changedFilters = {};
        // reset all filters not used
        for (const filter of this._filters.values()) {
            if (!filters.hasOwnProperty(filter.name)) {
                const changed = filter.reset();
                if (changed) {
                    changedFilters[filter.name] = filter.value;
                }
            }
        }
        // set filters to use
        for (const [name, value] of Object.entries(filters)) {
            const filter = this._filters.get(name);
            if (filter) {
                const changed = filter.setInternalValue(value);
                if (changed) {
                    changedFilters[filter.name] = filter.value;
                }
            }
        }
        return changedFilters;
    }
    getFiltersFromFilterSource() {
        const filters = {};
        const query = this._filterSource.getQuery();
        for (const [name, filter] of this._filters.entries()) {
            const queryValue = query[name];
            if (queryValue) { // has query value, typeof === string
                const value = filter.queryToValue(queryValue); // query value valid
                if (value !== undefined) {
                    filters[name] = value;
                }
            }
        }
        return filters;
    }
    getFiltersFromHistory() {
        if (this._historyKey) {
            if (filterHistory.hasFilters(this._historyKey)) {
                const filters = filterHistory.getFilters(this._historyKey);
                return filters.serialize();
            }
        }
        return {};
    }
    pushToQuerySource() {
        const query = this._filters.values().reduce((map, filter) => {
            return Object.assign(Object.assign({}, map), filter.toQuerySource());
        }, {});
        if (this._filterSource) {
            this._filterSource.push(query);
        }
    }
}
