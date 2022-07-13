import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest';
import { Model, ModelJSON } from '../Model';
import { FieldValidator, FieldValidatorJSON } from '../validator/FieldValidator';
export declare type FieldJSON = {
    type: string;
    default: FieldJSONValue;
    validator: FieldValidatorJSON;
    options: FieldOption[];
    options_request: ApiRequestJSON;
};
export declare type FieldValue = boolean | string | number | Date | null | Model | Model[];
export declare type FieldJSONValue = boolean | string | number | null | ModelJSON | ModelJSON[];
declare type FieldObjectOption = {
    title: string;
    value: FieldOption;
};
declare type FieldOption = boolean | string | number | FieldObjectOption;
export declare class Field {
    type: string;
    private _default;
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
    getOptions(): FieldOption[];
    default(): FieldValue;
    deserialize(value: FieldJSONValue): FieldValue;
    serialize(value: FieldValue): FieldJSONValue;
    protected fallbackDefault(): FieldValue;
    protected setupFieldValidator(json: FieldValidatorJSON): void;
}
export {};
//# sourceMappingURL=Field.d.ts.map