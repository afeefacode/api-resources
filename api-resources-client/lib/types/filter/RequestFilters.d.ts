import { BaseQuerySource } from './BaseQuerySource';
import { Filter, FilterValueType } from './Filter';
export declare type Filters = Record<string, Filter>;
export declare type UsedFilters = Record<string, FilterValueType>;
export declare class RequestFilters {
    private _filters;
    private _querySource;
    private _lastQuery;
    private _disableUpdates;
    private _eventTarget;
    constructor(querySource?: BaseQuerySource);
    querySource(querySource: BaseQuerySource): void;
    add(name: string, filter: Filter): void;
    getFilters(): Record<string, Filter>;
    hasFilter(name: string): boolean;
    getQuerySource(): BaseQuerySource;
    initFromUsed(usedFilters: UsedFilters): void;
    on(type: string, handler: () => {}): void;
    off(type: string, handler: () => {}): void;
    valueChanged(filters: Filters): void;
    initFromQuerySource(): boolean;
    pushToQuerySource(): void;
    reset(): void;
    serialize(options?: {}): UsedFilters;
}
//# sourceMappingURL=RequestFilters.d.ts.map