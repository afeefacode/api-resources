import { Filter } from '../Filter';
declare type Direction = 'asc' | 'desc';
declare type OrderFilterValue = [string, Direction] | undefined;
export declare class OrderFilter extends Filter {
    static type: string;
    protected valueToQuery(value: OrderFilterValue): string | undefined;
    protected queryToValue(value: string): OrderFilterValue | undefined;
}
export {};
//# sourceMappingURL=OrderFilter.d.ts.map