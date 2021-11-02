import { BaseFilterSource } from '../filter/BaseFilterSource';
import { ListViewConfig } from './ListViewConfig';
import { ListViewFilterBag } from './ListViewFilterBag';
export declare class ListViewModel {
    private _config;
    private _filterSource;
    private _historyKey;
    private _filters;
    private _eventTarget;
    constructor(config: ListViewConfig);
    getConfig(): ListViewConfig;
    filterSource(filterSource: BaseFilterSource): ListViewModel;
    getFilterSource(): BaseFilterSource | null;
    historyKey(historyKey: string): ListViewModel;
    getHistoryKey(): string | null;
    getFilters(): ListViewFilterBag;
    on(handler: () => {}): void;
    off(handler: () => {}): void;
    filterValueChanged(): void;
    private dispatchChange;
    private initFilters;
    private getFiltersFromFilterSource;
    private getFiltersFromHistory;
}
//# sourceMappingURL=ListViewModel.d.ts.map