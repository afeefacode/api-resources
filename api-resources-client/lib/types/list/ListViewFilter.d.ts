import { Filter, FilterValueType } from '../filter/Filter';
import { ListViewModel } from './ListViewModel';
export declare class ListViewFilter {
    private _filter;
    private _model;
    private _value;
    constructor(filter: Filter, model: ListViewModel);
    get value(): FilterValueType;
    set value(value: FilterValueType);
}
//# sourceMappingURL=ListViewFilter.d.ts.map