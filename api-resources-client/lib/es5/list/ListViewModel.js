import { FilterChangeEvent } from '../filter/FilterChangeEvent';
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
}
