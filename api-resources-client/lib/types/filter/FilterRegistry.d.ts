import { Filter } from './Filter';
declare class FilterRegistry {
    private _filters;
    register(type: string, FilterClass: typeof Filter): void;
    get(type: string): typeof Filter | null;
}
export declare const filterRegistry: FilterRegistry;
export declare function registerFilter(type: string, FilterClass: typeof Filter): void;
export declare function getFilter(type: string): typeof Filter | null;
export {};
//# sourceMappingURL=FilterRegistry.d.ts.map