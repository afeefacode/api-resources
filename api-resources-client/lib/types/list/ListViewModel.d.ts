import { ApiAction } from 'src/api/ApiAction';
import { ApiRequest } from '../api/ApiRequest';
import { BagEntries } from '../bag/Bag';
import { ActionFilterValueType } from '../filter/ActionFilter';
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
    initFilters({ source, history, used }?: {
        source: boolean;
        history: boolean;
        used: boolean;
    }): ListViewModel;
    filterSource(filterSource: ListViewFilterSource, pushToFilterSource: boolean): ListViewModel;
    getFilterSource(): ListViewFilterSource | null;
    historyKey(historyKey: string, saveInHistory: boolean): ListViewModel;
    getHistoryKey(): string | null;
    usedFilters(usedFilters: BagEntries<ActionFilterValueType> | null, count: number): ListViewModel;
    getUsedFilters(): BagEntries<ActionFilterValueType> | null;
    getFilters(): ListViewFilterBag;
    on(type: string, handler: () => {}): ListViewModel;
    off(type: string, handler: () => {}): ListViewModel;
    filterValueChanged(name: string): void;
    getApiRequest(): ApiRequest;
    /**
     * called if the the filter sources has changed and should
     * be reinitialized
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