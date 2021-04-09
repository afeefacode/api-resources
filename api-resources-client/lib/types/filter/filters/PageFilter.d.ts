import { Filter, FilterJSON } from '../Filter';
export declare type PageFilterJSON = FilterJSON & {
    default_page_size: number;
    page_sizes: number[];
};
export declare class PageFilter extends Filter {
    defaultPageSize: number;
    pageSizes: number[];
    protected setupParams(json: PageFilterJSON): void;
}
//# sourceMappingURL=PageFilter.d.ts.map