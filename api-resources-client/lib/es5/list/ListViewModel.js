import { PageFilter } from '../filter/filters/PageFilter';
import { ListViewFilter } from './ListViewFilter';
import { ListViewFilterBag } from './ListViewFilterBag';
import { ListViewFilterChangeEvent } from './ListViewFilterChangeEvent';
import { filterHistory } from './ListViewFilterHistory';
export class ListViewModel {
    constructor(config) {
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
        this._changedFilters[name] = this._filters.get(name).value;
        if (this._changedFiltersTimeout) {
            return;
        }
        this._changedFiltersTimeout = setTimeout(() => {
            clearTimeout(this._changedFiltersTimeout);
            this._changedFiltersTimeout = null;
            this.dispatchChange(this._changedFilters);
            this._changedFilters = {};
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
        // source did not really change, this is a looped hook
        const query = this._filterSource.getQuery();
        if (JSON.stringify(this._lastSavedQuery) === JSON.stringify(query)) {
            return;
        }
        const changedFilters = this.initFilterValues({
            source: true,
            history: false,
            used: false,
            filters: true
        });
        if (Object.keys(changedFilters).length) {
            this.dispatchChange(changedFilters);
        }
        // if a link without query is clicked,
        // and custom fiters apply, then this should
        // be set to the query string
        this.pushToFilterSource();
    }
    initFromUsedFilters(usedFilters, count) {
        this.setFilterValues(usedFilters);
        this.handleFilterHistory(count);
        this.pushToFilterSource();
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
            this.pushToFilterSource();
            this.dispatchChange(changedFilters);
        }
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
    dispatchChange(changedFilters) {
        this._eventTarget.dispatchEvent(new ListViewFilterChangeEvent('change', changedFilters));
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
            filtersToUse = this._config.getFilters();
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
