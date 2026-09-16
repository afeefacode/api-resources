import { Api } from '../api/Api.js';
import { ApiRequest } from '../api/ApiRequest.js';
import { BatchApiRequest } from '../api/BatchApiRequest.js';
import { ActionFilterJSON } from '../filter/ActionFilter.js';
import { ActionFilterBag } from '../filter/ActionFilterBag.js';
import { Resource } from '../resource/Resource.js';
import { ActionInput } from './ActionInput.js';
import { ActionParamJSON } from './ActionParams.js';
import { ActionResponse } from './ActionResponse.js';
export type ActionJSON = {
    params: Record<string, ActionParamJSON>;
    filters: Record<string, ActionFilterJSON>;
    input: {
        type: string;
    };
    response: {
        type: string;
    };
};
export declare class Action {
    private _resource;
    private _name;
    private _response;
    private _params;
    private _input;
    private _filters;
    constructor(resource: Resource, name: string, json: ActionJSON);
    getName(): string;
    getFullName(): string;
    getResponse(): ActionResponse | null;
    getInput(): ActionInput | null;
    getFilters(): ActionFilterBag;
    createRequest(): ApiRequest;
    batchRequest(): BatchApiRequest;
    getResource(): Resource;
    getApi(): Api;
}
//# sourceMappingURL=Action.d.ts.map