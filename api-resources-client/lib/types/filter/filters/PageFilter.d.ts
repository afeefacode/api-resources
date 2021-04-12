import { Query } from '../BaseQuerySource';
import { Filter } from '../Filter';
declare type Value = {
    page: number;
    page_size: number;
};
export declare class PageFilter extends Filter {
    static type: string;
    value: Value;
    fromQuerySource(query: Query): void;
    toQuerySource(): Query;
}
export {};
//# sourceMappingURL=PageFilter.d.ts.map