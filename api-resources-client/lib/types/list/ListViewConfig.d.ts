import { BagEntries } from 'src/bag/Bag';
import { FilterValueType } from 'src/filter/Filter';
import { Action } from '../action/Action';
export declare class ListViewConfig {
    private _action;
    private _fields;
    private _params;
    private _filters;
    action({ apiType, resourceType, actionName }: {
        apiType: string | null;
        resourceType: string;
        actionName: string;
    }): ListViewConfig;
    getAction(): Action | null;
    params(params: BagEntries<unknown>): ListViewConfig;
    getParams(): BagEntries<unknown>;
    filters(filters: BagEntries<FilterValueType>): ListViewConfig;
    getFilters(): BagEntries<FilterValueType>;
    fields(fields: BagEntries<unknown>): ListViewConfig;
    getFields(): BagEntries<unknown>;
}
//# sourceMappingURL=ListViewConfig.d.ts.map