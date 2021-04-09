import { Api, ApiSchemaJSON } from './api/Api';
import { Field } from './field/Field';
import { Filter } from './filter/Filter';
import { Type } from './type/Type';
import { Validator } from './validator/Validator';
declare class ApiResources {
    private _apis;
    private _fields;
    private _validators;
    private _filters;
    private _types;
    private _schemasToLoad;
    private _schmemaLoadCount;
    constructor();
    get isLoaded(): boolean;
    loaded(): Promise<ApiSchemaJSON[]>;
    registerApi(name: string, baseUrl: string): Api;
    registerApis(apis: Record<string, string>): void;
    getApi(name: string): Api | null;
    setup(): Promise<ApiSchemaJSON[]>;
    registerField(type: string, FieldClass: typeof Field): void;
    registerFields(fields: Record<string, typeof Field>): void;
    getField(type: string): (typeof Field | null);
    registerValidator(type: string, validator: Validator): void;
    registerValidators(validators: Record<string, Validator>): void;
    getValidator(type: string): Validator | null;
    registerFilter(type: string, FilterClass: typeof Filter): void;
    registerFilters(filters: Record<string, typeof Filter>): void;
    getFilter(type: string): (typeof Filter | null);
    registerType(typeName: string, type: Type): void;
    getType(typeName: string): Type | null;
}
export declare const apiResources: ApiResources;
export {};
//# sourceMappingURL=ApiResources.d.ts.map