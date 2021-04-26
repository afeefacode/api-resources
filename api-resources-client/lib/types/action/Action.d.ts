import { Api } from '../api/Api';
import { ApiRequest } from '../api/ApiRequest';
import { BaseQuerySource } from '../filter/BaseQuerySource';
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
export declare class Action {
    private _resource;
    private _name;
    private _response;
    private _params;
    private _input;
    private _filters;
    constructor(resource: Resource, name: string, json: ActionJSON);
    getName(): string;
    getFilters(): Record<string, Filter>;
    createRequestFilters(querySource?: BaseQuerySource): RequestFilters;
    request(): ApiRequest;
    getResource(): Resource;
    getApi(): Api;
}
//# sourceMappingURL=Action.d.ts.map