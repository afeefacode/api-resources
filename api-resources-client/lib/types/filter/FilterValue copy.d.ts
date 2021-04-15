export declare type FilterValueType = boolean | string | number | [string, FilterValue] | null;
export declare class FilterValue {
    value: FilterValueType;
    constructor();
    serialize(): FilterValueType;
    valueChanged(): void;
}
//# sourceMappingURL=FilterValue%20copy.d.ts.map