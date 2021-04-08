import { FilterJSON } from '../filter/Filter';
import { ActionParamJSON } from './ActionParams';
export declare type ActionJSON = {
    params: Record<string, ActionParamJSON>;
    filters: Record<string, FilterJSON>;
    input: {
        type: string;
    };
    response: {
        type: string;
    };
};
export declare class Action {
    private _name;
    private _response;
    private _params;
    private _input;
    private _filters;
    constructor(name: string, json: ActionJSON);
}
//# sourceMappingURL=Action.d.ts.map