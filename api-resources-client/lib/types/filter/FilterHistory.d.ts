import { Action } from 'src/action/Action';
import { BaseQuerySource } from './BaseQuerySource';
import { RequestFilters } from './RequestFilters';
declare class FilterHistory {
    private filters;
    private validFilters;
    createRequestFilters(listId: string, action: Action, querySource: BaseQuerySource): RequestFilters;
    markFiltersValid(listId: string, valid: boolean): void;
}
export declare const filterHistory: FilterHistory;
export {};
//# sourceMappingURL=FilterHistory.d.ts.map