import { BaseQuerySource, Query } from './BaseQuerySource';
import { Filter } from './Filter';
export declare class RequestFilters {
    private _filters;
    private _querySource;
    private _lastQuery;
    private _eventTarget;
    constructor(querySource?: BaseQuerySource);
    querySource(querySource: BaseQuerySource): void;
    add(name: string, filter: Filter): void;
    getFilters(): Record<string, Filter>;
    getQuerySource(): BaseQuerySource;
    initFromUsed(usedFilters: Query): void;
    on(type: string, handler: () => {}): void;
    off(type: string, handler: () => {}): void;
    valueChanged(filter: Filter): void;
    queryDidChange(): boolean;
    initFromQuerySource(): boolean;
    pushToQuerySource(): void;
    resetFilters(): void;
    serialize(): Query;
}
//# sourceMappingURL=RequestFilters%20copy.d.ts.map