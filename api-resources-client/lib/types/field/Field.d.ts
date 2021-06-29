import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest';
import { Model, ModelJSON } from '../Model';
import { Validator, ValidatorJSON } from '../validator/Validator';
export declare type FieldJSON = {
    type: string;
    validator: ValidatorJSON;
    options_request: ApiRequestJSON;
};
export declare type FieldValue = boolean | string | number | Date | null | Model | Model[];
export declare type FieldJSONValue = boolean | string | number | null | ModelJSON | ModelJSON[];
export declare class Field {
    type: string;
    private _validator;
    private _optionsRequestFactory;
    constructor();
    newInstance<T>(): T;
    createTypeField(json: FieldJSON): Field;
    getValidator(): Validator | null;
    hasOptionsRequest(): boolean;
    getOptionsRequest(): ApiRequest | null;
    default(): FieldValue;
    deserialize(value: FieldJSONValue): FieldValue;
    serialize(value: FieldValue): FieldJSONValue;
    protected setupTypeFieldValidator(json: ValidatorJSON): void;
}
//# sourceMappingURL=Field.d.ts.map