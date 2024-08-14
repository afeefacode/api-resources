import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest';
import { Model, ModelAttributes, ModelJSON } from '../Model';
import { RelatedTypeJSON } from '../type/RelatedType';
import { FieldValidator, FieldValidatorJSON } from '../validator/FieldValidator';
export type FieldJSON = {
    type: string;
    related_type?: RelatedTypeJSON;
    default?: FieldJSONValue;
    validator?: FieldValidatorJSON;
    options?: FieldOption[];
    options_request?: ApiRequestJSON;
};
export type FieldValue = boolean | string | number | Date | null | Model | Model[];
export type FieldJSONValue = boolean | string | number | null | ModelJSON | ModelJSON[];
type FieldObjectOption = {
    title: string;
    value: FieldOption;
};
type FieldOption = boolean | string | number | FieldObjectOption;
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
    createOptionsRequest(): ApiRequest | null;
    hasOptions(): boolean;
    getOptions(): FieldOption[];
    default(): FieldValue;
    deserialize(value: FieldJSONValue): FieldValue;
    serialize(value: FieldValue, _fields?: ModelAttributes | true): FieldJSONValue;
    protected fallbackDefault(): FieldValue;
    protected setupFieldValidator(json: FieldValidatorJSON): void;
}
export {};
//# sourceMappingURL=Field.d.ts.map