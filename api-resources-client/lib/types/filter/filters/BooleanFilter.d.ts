import { Filter, FilterJSON } from '../Filter';
export declare type BooleanFilterJSON = FilterJSON & {
    values: boolean[];
};
export declare class BooleanFilter extends Filter {
    values: boolean[];
    constructor(json: BooleanFilterJSON);
}
//# sourceMappingURL=BooleanFilter.d.ts.map