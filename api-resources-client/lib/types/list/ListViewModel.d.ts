import { ApiAction } from 'src/api/ApiAction';
import { ApiRequest } from '../api/ApiRequest';
import { BagEntries } from '../bag/Bag';
import { ActionFilterValueType } from '../filter/ActionFilter';
import { ListViewFilter } from './ListViewFilter';
import { ListViewFilterBag } from './ListViewFilterBag';
import { ListViewFilterSource } from './ListViewFilterSource';
export declare class ListViewModel {
    private _apiAction;
    private _filterSource;
    private _pushToFilterSource;
    private _historyKey;
    private _saveInHistory;
    private _usedFilters;
    private _usedFiltersCount;
    private _filters;
    private _eventTarget;
    private _changedFilters;
    private _changedFiltersTimeout;
    private _lastSavedQuery;
    constructor(apiAction: ApiAction);
    /**
     * Take all filters sources and some magic
     * and set up initial values for all available
     * filters.
     */
    initFilters({ source, history, used }?: {
        source: boolean;
        history: boolean;
        used: boolean;
    }): ListViewModel;
    filterSource(filterSource: ListViewFilterSource, pushToFilterSource: boolean): ListViewModel;
    getFilterSource(): ListViewFilterSource | null;
    historyKey(historyKey: string, saveInHistory: boolean): ListViewModel;
    getHistoryKey(): string | null;
    getNonDefaultFilterNames(): string[];
    usedFilters(usedFilters: BagEntries<ActionFilterValueType> | null, count: number): ListViewModel;
    getUsedFilters(): BagEntries<ActionFilterValueType> | null;
    getFilters(): ListViewFilterBag;
    getFilter(name: string): ListViewFilter | null;
    on(type: string, handler: () => {}): ListViewModel;
    off(type: string, handler: () => {}): ListViewModel;
    filterValueChanged(name: string): void;
    getApiRequest(): ApiRequest;
    /**
     * called if the the filter source has changed and should
     * be reinitialized (e.g. query string got modified)
     */
    filterSourceChanged(): void;
    initFromUsedFilters(usedFilters: BagEntries<ActionFilterValueType>, count: number): void;
    resetFilters(): void;
    private handleFilterHistory;
    private dispatchChange;
    private initFilterValues;
    private setFilterValues;
    private getFiltersFromFilterSource;
    private getFiltersFromHistory;
    private pushToFilterSource;
}
//# sourceMappingURL=ListViewModel.d.ts.map