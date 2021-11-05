import { ApiRequest } from '../api/ApiRequest';
import { BagEntries } from '../bag/Bag';
import { BaseFilterSource } from '../filter/BaseFilterSource';
import { FilterValueType } from '../filter/Filter';
import { ListViewConfig } from './ListViewConfig';
import { ListViewFilterBag } from './ListViewFilterBag';
export declare class ListViewModel {
    private _config;
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
    constructor(config: ListViewConfig);
    getConfig(): ListViewConfig;
    initFilters({ source, history, used }?: {
        source: boolean;
        history: boolean;
        used: boolean;
    }): ListViewModel;
    filterSource(filterSource: BaseFilterSource, pushToFilterSource: boolean): ListViewModel;
    getFilterSource(): BaseFilterSource | null;
    historyKey(historyKey: string, saveInHistory: boolean): ListViewModel;
    getHistoryKey(): string | null;
    usedFilters(usedFilters: BagEntries<FilterValueType> | null, count: number): ListViewModel;
    getUsedFilters(): BagEntries<FilterValueType> | null;
    getFilters(): ListViewFilterBag;
    on(type: string, handler: () => {}): ListViewModel;
    off(type: string, handler: () => {}): ListViewModel;
    filterValueChanged(name: string): void;
    getApiRequest(): ApiRequest | null;
    /**
     * called if the the filter sources has changed and should
     * be reinitialized
     */
    filterSourceChanged(): void;
    initFromUsedFilters(usedFilters: BagEntries<FilterValueType>, count: number): void;
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