import { ValidatorJSON } from '../validator/Validator';
export declare type FieldJSON = {
    type: string;
    validator: ValidatorJSON;
};
export declare class Field {
    private _validator;
    createTypeField(json: FieldJSON): Field;
    protected setupTypeFieldValidator(json: ValidatorJSON): void;
}
//# sourceMappingURL=Field.d.ts.map