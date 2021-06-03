import { Api } from '../api/Api';
import { ApiRequest } from '../api/ApiRequest';
import { BaseFilterSource } from '../filter/BaseFilterSource';
import { Filter, FilterJSON } from '../filter/Filter';
import { RequestFilters } from '../filter/RequestFilters';
import { Resource } from '../resource/Resource';
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
    getFilters(): ActionFilters;
    createRequestFilters(historyKey?: string, querySource?: BaseFilterSource): RequestFilters;
    request(): ApiRequest;
    getResource(): Resource;
    getApi(): Api;
}
//# sourceMappingURL=Action.d.ts.map