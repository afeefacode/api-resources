import { ActionJSON } from '../action/Action';
export declare type ResourceJSON = Record<string, ActionJSON>;
export declare class Resource {
    private _actions;
    constructor(json: ResourceJSON);
}
//# sourceMappingURL=Resource.d.ts.map