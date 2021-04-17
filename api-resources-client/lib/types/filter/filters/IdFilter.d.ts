import { Filter } from '../Filter';
declare type IdFilterValue = string;
export declare class IdFilter extends Filter {
    static type: string;
    protected valueToQuery(value: IdFilterValue): string | undefined;
    protected queryToValue(value: string): IdFilterValue | undefined;
}
export {};
//# sourceMappingURL=IdFilter.d.ts.map