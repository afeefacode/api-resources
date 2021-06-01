import { RequestFilters } from './RequestFilters';
declare class FilterHistory {
    private filters;
    hasFilters(historyKey: string): boolean;
    getFilters(historyKey: string): RequestFilters;
    addFilters(historyKey: string, filters: RequestFilters): void;
    removeFilters(historyKey: string): void;
}
export declare const filterHistory: FilterHistory;
export {};
//# sourceMappingURL=FilterHistory.d.ts.map