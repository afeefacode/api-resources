import { ValidatorJSON } from '../validator/Validator';
export declare type FieldJSON = {
    type: string;
    validator: ValidatorJSON;
};
export declare class Field {
    private _validator;
    constructor(json: FieldJSON);
}
//# sourceMappingURL=Field.d.ts.map