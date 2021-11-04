import { ListViewFilterBag } from '../list/ListViewFilterBag';
declare class FilterHistory {
    private filters;
    hasFilters(historyKey: string): boolean;
    getFilters(historyKey: string): ListViewFilterBag;
    setFilters(historyKey: string, filters: ListViewFilterBag): void;
    removeFilters(historyKey: string): void;
}
export declare const filterHistory: FilterHistory;
export {};
//# sourceMappingURL=FilterHistory.d.ts.map