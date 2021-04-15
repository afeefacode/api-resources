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
    constructor();
    schemasLoaded(): Promise<ApiSchemaJSON[]>;
    registerApi(name: string, baseUrl: string): ApiResources;
    registerApis(apis: Record<string, string>): ApiResources;
    getApi(name: string): Api | null;
    registerField(field: Field): void;
    registerFields(fields: Field[]): void;
    getField(type: string): Field | null;
    registerValidator(type: string, validator: Validator): void;
    registerValidators(validators: Record<string, Validator>): void;
    getValidator(type: string): Validator | null;
    registerFilter(filter: Filter): void;
    registerFilters(filters: Filter[]): void;
    getFilter(type: string): (Filter | null);
    registerType(typeName: string, type: Type): void;
    getType(typeName: string): Type | null;
}
export declare const apiResources: ApiResources;
export {};
//# sourceMappingURL=ApiResources.d.ts.map