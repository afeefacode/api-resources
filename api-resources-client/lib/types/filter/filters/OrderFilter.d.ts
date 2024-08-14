import { Filter } from '../Filter';
type Direction = 'asc' | 'desc';
type OrderFilterValue = Record<string, Direction> | null;
export declare class OrderFilter extends Filter {
    static type: string;
    valueToQuery(value: OrderFilterValue): string | undefined;
    queryToValue(value: string): OrderFilterValue | undefined;
}
export {};
//# sourceMappingURL=OrderFilter.d.ts.map