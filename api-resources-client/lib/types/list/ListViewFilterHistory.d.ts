import { ListViewFilterBag } from './ListViewFilterBag';
declare class ListViewFilterHistory {
    private filters;
    hasFilters(historyKey: string): boolean;
    getFilters(historyKey: string): ListViewFilterBag;
    setFilters(historyKey: string, filters: ListViewFilterBag): void;
    removeFilters(historyKey: string): void;
}
export declare const filterHistory: ListViewFilterHistory;
export {};
//# sourceMappingURL=ListViewFilterHistory.d.ts.map