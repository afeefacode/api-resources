import { BaseFilterValue } from '../BaseFilterValue';
import { Filter } from '../Filter';
export declare class PageFilter extends Filter {
    static type: string;
    protected _defaultValue: BaseFilterValue;
    protected _value: BaseFilterValue;
    protected types: {
        page: string;
        page_size: string;
    };
}
//# sourceMappingURL=PageFilter%20copy.d.ts.map