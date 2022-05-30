import { Action } from './action/Action';
import { Api, ApiSchemaJSON } from './api/Api';
import { ApiRequest } from './api/ApiRequest';
import { Field } from './field/Field';
import { Filter } from './filter/Filter';
import { Model } from './Model';
import { Type } from './type/Type';
import { Validator } from './validator/Validator';
declare type ModelType = typeof Model;
declare class ApiResources {
    private _apis;
    private _defaultApiType;
    private _models;
    private _fields;
    private _validators;
    private _filters;
    private _types;
    private _schemasToLoad;
    constructor();
    schemasLoaded(): Promise<ApiSchemaJSON[]>;
    registerApi(type: string, baseUrl: string): ApiResources;
    registerApis(apis: Record<string, string>): ApiResources;
    defaultApi(type: string): ApiResources;
    getApi(type?: string | null): Api | null;
    hasApi(type: string): boolean;
    createRequest({ apiType, resourceType, actionName }: {
        apiType: string | null;
        resourceType: string;
        actionName: string;
    }): ApiRequest | null;
    getAction({ apiType, resourceType, actionName }: {
        apiType: string | null;
        resourceType: string;
        actionName: string;
    }): Action | null;
    registerField(field: Field): ApiResources;
    registerFields(fields: Field[]): ApiResources;
    getField(type: string): Field | null;
    registerModel(Model: ModelType): ApiResources;
    registerModels(models: ModelType[]): ApiResources;
    getModelClass(type: string): ModelType;
    registerValidator(type: string, validator: Validator): ApiResources;
    registerValidators(validators: Record<string, Validator>): ApiResources;
    getValidator(type: string): Validator | null;
    registerFilter(filter: Filter): ApiResources;
    registerFilters(filters: Filter[]): ApiResources;
    getFilter(type: string): (Filter | null);
    registerType(typeName: string, type: Type): ApiResources;
    getType(typeName: string): Type | null;
}
export declare const apiResources: ApiResources;
export {};
//# sourceMappingURL=ApiResources.d.ts.map