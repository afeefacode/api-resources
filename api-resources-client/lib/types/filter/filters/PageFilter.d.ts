import { QuerySource } from '../BaseQuerySource';
import { Filter } from '../Filter';
declare type PageFilterValue = {
    page: number;
    page_size: number;
};
declare type PageQuery = QuerySource & {
    page: string;
    page_size: string;
};
export declare class PageFilter extends Filter {
    static type: string;
    value: PageFilterValue;
    fromQuerySource(query: PageQuery): void;
}
export {};
//# sourceMappingURL=PageFilter.d.ts.map