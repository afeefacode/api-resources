import { ActionFilters } from '../action/Action';
import { BaseFilterSource } from './BaseFilterSource';
import { Filter, FilterValueType } from './Filter';
export declare type Filters = Record<string, Filter>;
export declare type UsedFilters = Record<string, FilterValueType>;
/**
 * Request filters do have multiple change entry points:
 * - create: read existing query string and init filter values -> consumer should initially -> LOAD
 * - get from history: consumer should initially -> LOAD
 * - click: update filter values and update query string  -> RELOAD
 * - query changed: update filter values -> RELOAD
 * - init used filters: update filter values and update query string
 */
export declare class RequestFilters {
    private _filters;
    private _historyKey?;
    private _filterSource;
    private _lastQuery;
    private _disableUpdates;
    private _eventTarget;
    static create(filters: ActionFilters, historyKey?: string, filterSource?: BaseFilterSource): RequestFilters;
    static fromHistory(historyKey: string): RequestFilters | null;
    constructor(filters: ActionFilters, historyKey?: string, filterSource?: BaseFilterSource);
    on(type: string, handler: () => {}): void;
    off(type: string, handler: () => {}): void;
    getFilters(): Filters;
    initFromUsed(usedFilters: UsedFilters, count: number): void;
    filterSourceChanged(): void;
    valueChanged(filters: Filters): void;
    reset(): void;
    serialize(options?: {}): UsedFilters;
    private dispatchUpdate;
    private initFromQuerySource;
    private pushToQuerySource;
}
//# sourceMappingURL=RequestFilters.d.ts.map