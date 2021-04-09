import { Filter, FilterJSON } from '../Filter';
export declare type BooleanFilterJSON = FilterJSON & {
    values: boolean[];
};
export declare class BooleanFilter extends Filter {
    values: boolean[];
    protected setupParams(json: BooleanFilterJSON): void;
}
//# sourceMappingURL=BooleanFilter.d.ts.map