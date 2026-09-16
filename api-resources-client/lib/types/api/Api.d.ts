import { Action } from '../action/Action.js';
import { ModelJSON } from '../Model.js';
import { Resource, ResourceJSON } from '../resource/Resource.js';
import { TypeJSON } from '../type/Type.js';
import { ValidatorJSON } from '../validator/Validator.js';
export type ApiSchemaJSON = {
    types: Record<string, TypeJSON>;
    resources: Record<string, ResourceJSON>;
    validators: Record<string, ValidatorJSON>;
};
export type ResultDataJSON = {
    data: ModelJSON | ModelJSON[];
};
export declare class Api {
    private _baseUrl;
    private _resources;
    private _types;
    private _validators;
    constructor(baseUrl: string);
    getBaseUrl(): string;
    loadSchema(): Promise<ApiSchemaJSON>;
    getResource(resourceType: string): Resource | null;
    getAction(resourceType: string, actionName: string): Action | null;
}
//# sourceMappingURL=Api.d.ts.map