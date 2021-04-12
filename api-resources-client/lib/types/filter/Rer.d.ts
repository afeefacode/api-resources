export declare type FilterJSON = {
    type: string;
};
export declare class Filter {
    type: string;
    value: any;
    createActionFilter(json: FilterJSON): Filter;
    createRequestFilter(): Filter;
    setType(type: string): void;
    protected setupParams(_json: FilterJSON): void;
    protected cloneParams(_filter: Filter): void;
}
//# sourceMappingURL=Rer.d.ts.map