import { Filter, FilterJSON } from '../Filter';
declare type Direction = 'asc' | 'desc';
declare type OrderFilterJSON = FilterJSON & {
    fields: {
        [name: string]: Direction[];
    };
};
export declare class OrderFilter extends Filter {
    fields: Record<string, Direction[]>;
    protected setupParams(json: OrderFilterJSON): void;
}
export {};
//# sourceMappingURL=OrderFilter.d.ts.map