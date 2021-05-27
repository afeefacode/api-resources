import { Model, ModelJSON } from '../Model';
import { Validator, ValidatorJSON } from '../validator/Validator';
export declare type FieldJSON = {
    type: string;
    validator: ValidatorJSON;
};
export declare type FieldValue = boolean | string | number | Date | null | Model | Model[];
export declare type FieldJSONValue = boolean | string | number | null | ModelJSON | ModelJSON[];
export declare class Field {
    type: string;
    constructor();
    private _validator;
    newInstance<T>(): T;
    createTypeField(name: string, json: FieldJSON): Field;
    getValidator(): Validator | null;
    default(): FieldValue;
    deserialize(value: FieldJSONValue): FieldValue;
    serialize(value: FieldValue): FieldJSONValue;
    protected setupTypeFieldValidator(fieldName: string, json: ValidatorJSON): void;
}
//# sourceMappingURL=Field.d.ts.map