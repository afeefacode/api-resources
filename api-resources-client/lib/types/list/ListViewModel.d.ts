import { ApiRequest } from '../api/ApiRequest';
import { BagEntries } from '../bag/Bag';
import { BaseFilterSource } from '../filter/BaseFilterSource';
import { FilterValueType } from '../filter/Filter';
import { ListViewConfig } from './ListViewConfig';
import { ListViewFilterBag } from './ListViewFilterBag';
export declare class ListViewModel {
    private _config;
    private _filterSource;
    private _historyKey;
    private _filters;
    private _eventTarget;
    private changedFilters;
    private changedFiltersTimeout;
    constructor(config: ListViewConfig);
    getConfig(): ListViewConfig;
    initFilters({ filterSource, historyKey }?: {
        filterSource?: BaseFilterSource;
        historyKey?: string;
    }): ListViewModel;
    getFilterSource(): BaseFilterSource | null;
    getHistoryKey(): string | null;
    getFilters(): ListViewFilterBag;
    saveFiltersInHistory(): ListViewModel;
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
    private dispatchChange;
    private initFilterValues;
    private setFilterValues;
    private getFiltersFromFilterSource;
    private getFiltersFromHistory;
    private pushToQuerySource;
}
//# sourceMappingURL=ListViewModel.d.ts.map