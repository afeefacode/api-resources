import { Api } from '../api/Api';
import { ApiRequest } from '../api/ApiRequest';
import { BatchApiRequest } from '../api/BatchApiRequest';
import { BaseFilterSource } from '../filter/BaseFilterSource';
import { Filter, FilterJSON } from '../filter/Filter';
import { RequestFilters } from '../filter/RequestFilters';
import { Resource } from '../resource/Resource';
import { ActionInput } from './ActionInput';
import { ActionParamJSON } from './ActionParams';
import { ActionResponse } from './ActionResponse';
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
export declare type ActionFilters = Record<string, Filter>;
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
    getFilters(): ActionFilters;
    createRequestFilters(historyKey?: string, filterSource?: BaseFilterSource): RequestFilters;
    createRequest(): ApiRequest;
    batchRequest(): BatchApiRequest;
    getResource(): Resource;
    getApi(): Api;
}
//# sourceMappingURL=Action.d.ts.map