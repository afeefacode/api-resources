import { Filter, FilterJSON } from '../Filter';
declare type Direction = 'asc' | 'desc';
declare type OrderFilterJSON = FilterJSON & {
    [name: string]: Direction[];
};
export declare class OrderFilter extends Filter {
    [name: string]: Direction[];
    constructor(json: OrderFilterJSON);
}
export {};
//# sourceMappingURL=OrderFilter.d.ts.map