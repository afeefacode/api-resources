import { ActionFilters } from '../action/Action';
import { BaseQuerySource } from './BaseQuerySource';
import { Filter, FilterValueType } from './Filter';
export declare type Filters = Record<string, Filter>;
export declare type UsedFilters = Record<string, FilterValueType>;
/**
 * Request filters do have multiple change entry points:
 * - create: read existing query string and init filter values -> consumer should initially LOAD
 * - get from history: consumer should initially LOAD
 * - click: update filter values and update query string  -> RELOAD
 * - query changed: update filter values -> RELOAD
 * - init used filters: update filter values and update query string
 */
export declare class RequestFilters {
    private _filters;
    private _historyKey?;
    private _querySource;
    private _lastQuery;
    private _disableUpdates;
    private _eventTarget;
    static create(filters: ActionFilters, historyKey?: string, querySource?: BaseQuerySource): RequestFilters;
    constructor(filters: ActionFilters, historyKey?: string, querySource?: BaseQuerySource);
    on(type: string, handler: () => {}): void;
    off(type: string, handler: () => {}): void;
    getFilters(): Filters;
    initFromUsed(usedFilters: UsedFilters, count: number): void;
    querySourceChanged(): void;
    valueChanged(_filters: Filters): void;
    reset(): void;
    serialize(options?: {}): UsedFilters;
    private dispatchUpdate;
    private initFromQuerySource;
    private pushToQuerySource;
}
//# sourceMappingURL=RequestFilters.d.ts.map