import { AxiosResponse } from 'axios';
import { Action } from 'src/action/Action';
import { ResourceJSON } from '../resource/Resource';
import { TypeJSON } from '../type/Type';
import { ValidatorJSON } from '../validator/Validator';
export declare type ApiSchemaJSON = {
    types: Record<string, TypeJSON>;
    resources: Record<string, ResourceJSON>;
    validators: Record<string, ValidatorJSON>;
};
export declare class Api {
    private _baseUrl;
    private _resources;
    private _types;
    private _validators;
    constructor(baseUrl: string);
    getBaseUrl(): string;
    loadSchema(): Promise<ApiSchemaJSON>;
    getAction(resourceName: string, actionName: string): Action | null;
    call(params: object): Promise<AxiosResponse>;
}
//# sourceMappingURL=Api.d.ts.map