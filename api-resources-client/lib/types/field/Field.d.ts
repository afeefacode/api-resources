import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest';
import { Model, ModelJSON } from '../Model';
import { FieldValidator, FieldValidatorJSON } from '../validator/FieldValidator';
export declare type FieldJSON = {
    type: string;
    validator: FieldValidatorJSON;
    options: Record<string, string>;
    options_request: ApiRequestJSON;
};
export declare type FieldValue = boolean | string | number | Date | null | Model | Model[];
export declare type FieldJSONValue = boolean | string | number | null | ModelJSON | ModelJSON[];
export declare class Field {
    type: string;
    private _validator;
    private _options;
    private _optionsRequestFactory;
    constructor();
    newInstance<T>(): T;
    createTypeField(json: FieldJSON): Field;
    getValidator(): FieldValidator | null;
    hasOptionsRequest(): boolean;
    getOptionsRequest(): ApiRequest | null;
    hasOptions(): boolean;
    getOptions(): Record<string, string>;
    default(): FieldValue;
    deserialize(value: FieldJSONValue): FieldValue;
    serialize(value: FieldValue): FieldJSONValue;
    protected setupFieldValidator(json: FieldValidatorJSON): void;
}
//# sourceMappingURL=Field.d.ts.map