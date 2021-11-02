import { FilterChangeEvent } from '../filter/FilterChangeEvent';
import { filterHistory } from '../filter/FilterHistory';
import { ListViewFilter } from './ListViewFilter';
import { ListViewFilterBag } from './ListViewFilterBag';
export class ListViewModel {
    constructor(config) {
        this._filterSource = null;
        this._historyKey = null;
        this._filters = new ListViewFilterBag();
        this._eventTarget = new EventTarget();
        this._config = config;
        const action = this._config.getAction();
        if (action) {
            for (const [name, filter] of action.getFilters().entries()) {
                this._filters.add(name, new ListViewFilter(filter, this));
            }
        }
        this.initFilters();
    }
    getConfig() {
        return this._config;
    }
    filterSource(filterSource) {
        this._filterSource = filterSource;
        return this;
    }
    getFilterSource() {
        return this._filterSource;
    }
    historyKey(historyKey) {
        this._historyKey = historyKey;
        return this;
    }
    getHistoryKey() {
        return this._historyKey;
    }
    getFilters() {
        return this._filters;
    }
    on(handler) {
        this._eventTarget.addEventListener('change', handler);
    }
    off(handler) {
        this._eventTarget.removeEventListener('change', handler);
    }
    filterValueChanged() {
        this.dispatchChange();
    }
    dispatchChange() {
        this._eventTarget.dispatchEvent(new FilterChangeEvent('change', {}));
    }
    initFilters() {
        let filtersToUse = {};
        // create and init request filters based on the current filter source state
        if (this._filterSource) {
            filtersToUse = this.getFiltersFromFilterSource();
        }
        // no filters based on filter source found, check history
        if (!Object.keys(filtersToUse).length) {
            if (this._historyKey) {
                // check any already stored filters from a previous request
                filtersToUse = this.getFiltersFromHistory();
            }
        }
        // no source or history filters found, check given filters at last
        if (!Object.keys(filtersToUse).length) {
            filtersToUse = this._config.getFilters();
        }
    }
    getFiltersFromFilterSource() {
        if (this._filterSource) {
            const query = this._filterSource.getQuery();
            for (const filter of this._filters.values()) {
                filter.initFromQuerySource(query);
            }
        }
        return {};
    }
    getFiltersFromHistory() {
        if (this._historyKey) {
            if (filterHistory.hasFilters(this._historyKey)) {
                const historyFilters = filterHistory.getFilters(this._historyKey);
                return historyFilters.serialize();
            }
        }
        return {};
    }
}
