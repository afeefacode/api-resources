export declare type FilterValueType = boolean | string | number | [string, FilterValue] | null;
export declare class FilterValue {
    value: FilterValueType;
    constructor();
    serialize(): FilterValueType;
    valueChanged(): void;
}
//# sourceMappingURL=Base.d.ts.map