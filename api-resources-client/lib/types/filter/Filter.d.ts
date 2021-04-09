export declare type FilterJSON = {
    type: string;
};
export declare class Filter {
    createActionFilter(json: FilterJSON): Filter;
    protected setupParams(_json: FilterJSON): void;
}
//# sourceMappingURL=Filter.d.ts.map