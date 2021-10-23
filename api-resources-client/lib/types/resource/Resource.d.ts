import { Action, ActionJSON } from '../action/Action';
import { Api } from '../api/Api';
export declare type ResourceJSON = Record<string, ActionJSON>;
export declare class Resource {
    private _api;
    private _type;
    private _actions;
    constructor(api: Api, name: string, json: ResourceJSON);
    getApi(): Api;
    getType(): string;
    getAction(name: string): Action | null;
}
//# sourceMappingURL=Resource.d.ts.map