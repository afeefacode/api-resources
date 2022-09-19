import { ListViewFilter } from './ListViewFilter';
import { ListViewFilterBag } from './ListViewFilterBag';
import { ListViewFilterChangeEvent } from './ListViewFilterChangeEvent';
import { filterHistory } from './ListViewFilterHistory';
export class ListViewModel {
    constructor(apiAction) {
        this._filterSource = null;
        this._pushToFilterSource = false;
        this._historyKey = null;
        this._saveInHistory = false;
        this._usedFilters = null;
        this._usedFiltersCount = 0;
        this._filters = new ListViewFilterBag();
        this._eventTarget = new EventTarget();
        this._changedFilters = {};
        this._changedFiltersTimeout = null;
        this._lastSavedQuery = null;
        this._apiAction = apiAction;
        const action = this._apiAction.getAction();
        if (action) {
            for (const [name, filter] of action.getFilters().entries()) {
                this._filters.add(name, new ListViewFilter(filter, this));
            }
        }
    }
    /**
     * Take all filters sources and some magic
     * and set up initial values for all available
     * filters.
     */
    initFilters({ source, history, used } = { source: false, history: false, used: false }) {
        if (source && !this._filterSource) {
            console.warn('Can\'t init from filter source without setting up a filter source.');
        }
        if (history && !this._historyKey) {
            console.warn('Can\'t init from history without setting up a history key.');
        }
        if (used && !this._usedFilters) {
            console.warn('Can\'t init from used filters without setting up used filters.');
        }
        this.initFilterValues({ source, history, used, filters: true });
        if (this._usedFilters) {
            this.handleFilterHistory(this._usedFiltersCount);
        }
        this.pushToFilterSource();
        return this;
    }
    filterSource(filterSource, pushToFilterSource) {
        this._filterSource = filterSource;
        this._pushToFilterSource = pushToFilterSource;
        return this;
    }
    getFilterSource() {
        return this._filterSource;
    }
    historyKey(historyKey, saveInHistory) {
        this._historyKey = historyKey;
        this._saveInHistory = saveInHistory;
        return this;
    }
    getHistoryKey() {
        return this._historyKey;
    }
    getNonDefaultFilterNames() {
        const filterNames = [];
        this._filters.values().forEach(f => {
            if (!f.hasDefaultValueSet()) {
                filterNames.push(f.name);
            }
        });
        return filterNames;
    }
    usedFilters(usedFilters, count) {
        this._usedFilters = usedFilters;
        this._usedFiltersCount = count;
        return this;
    }
    getUsedFilters() {
        return this._usedFilters;
    }
    getFilters() {
        return this._filters;
    }
    getFilter(name) {
        return this._filters.get(name);
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
        if (this._filters.get(name).filter.type !== 'Afeefa.PageFilter') {
            const pageFilter = this._filters.values().find(f => f.filter.type === 'Afeefa.PageFilter');
            if (pageFilter) {
                pageFilter.reset();
            }
        }
        this._changedFilters[name] = this._filters.get(name).value;
        this.dispatchChange();
    }
    getApiRequest() {
        const request = this._apiAction.getApiRequest();
        request.filters(this._filters.serialize());
        return request;
    }
    /**
     * called if the the filter source has changed and should
     * be reinitialized (e.g. query string got modified)
     */
    filterSourceChanged() {
        if (!this._filterSource) {
            console.warn('Can\'t notify about changed filter source without setting up a filter source.');
            return;
        }
        // source did not really change, this is a looped hook
        const query = this._filterSource.getQuery();
        if (JSON.stringify(this._lastSavedQuery) === JSON.stringify(query)) {
            return;
        }
        this._changedFilters = this.initFilterValues({
            source: true,
            history: false,
            used: false,
            filters: true
        });
        this.dispatchChange();
        // if a link without query is clicked,
        // and custom filters apply, then this should
        // be set to the query string
        this.pushToFilterSource();
    }
    initFromUsedFilters(usedFilters, count) {
        this.setFilterValues(usedFilters);
        this.handleFilterHistory(count);
        this.pushToFilterSource();
    }
    resetFilters() {
        this._changedFilters = {};
        this._filters.values().forEach(f => {
            const changed = f.reset();
            if (changed) {
                this._changedFilters[f.name] = f.value;
            }
        });
        this.dispatchChange();
    }
    handleFilterHistory(count) {
        const historyKey = this._historyKey;
        if (this._saveInHistory) {
            if (!count) {
                filterHistory.removeFilters(historyKey);
            }
            else {
                // always overwrite saved filters with current ones
                filterHistory.setFilters(historyKey, this._filters);
            }
        }
    }
    dispatchChange() {
        if (!Object.keys(this._changedFilters).length) {
            return;
        }
        if (this._changedFiltersTimeout) {
            return;
        }
        this._changedFiltersTimeout = setTimeout(() => {
            clearTimeout(this._changedFiltersTimeout);
            this._changedFiltersTimeout = null;
            this._eventTarget.dispatchEvent(new ListViewFilterChangeEvent('change', this._changedFilters));
            this._changedFilters = {};
        }, 10);
    }
    initFilterValues({ source, history, used, filters }) {
        let filtersToUse = {};
        // check used filters
        if (used) {
            filtersToUse = this._usedFilters;
            history = false;
            source = false;
            filters = false;
        }
        // check any already stored filters from a previous request
        if (history && filterHistory.hasFilters(this._historyKey)) {
            filtersToUse = this.getFiltersFromHistory();
            source = false;
            filters = false;
        }
        if (source) {
            filtersToUse = this.getFiltersFromFilterSource();
            // source filters found, ignore any custom set up filter
            if (Object.keys(filtersToUse).length) {
                filters = false;
            }
        }
        if (filters) {
            filtersToUse = this._apiAction.getFilters() || {};
        }
        return this.setFilterValues(filtersToUse);
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
    pushToFilterSource() {
        if (this._pushToFilterSource) {
            const query = this._filters.values()
                .reduce((map, filter) => {
                return Object.assign(Object.assign({}, map), filter.toQuerySource());
            }, {});
            this._filterSource.push(query);
            this._lastSavedQuery = query;
        }
    }
}
