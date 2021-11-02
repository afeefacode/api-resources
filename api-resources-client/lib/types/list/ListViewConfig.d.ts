import { Action } from '../action/Action';
declare type BagType = Record<string, unknown>;
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
    params(params: BagType): ListViewConfig;
    getParams(): BagType;
    filters(filters: BagType): ListViewConfig;
    getFilters(): BagType;
    fields(fields: BagType): ListViewConfig;
    getFields(): BagType;
}
export {};
//# sourceMappingURL=ListViewConfig.d.ts.map