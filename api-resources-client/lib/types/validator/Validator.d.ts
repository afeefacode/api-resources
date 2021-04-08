import { RuleJSON } from './Rule';
export declare type ValidatorJSON = {
    type: string;
    rules: Record<string, RuleJSON>;
    params: Record<string, unknown>;
};
export declare class Validator {
    private _rules;
    private _params;
    setup(json: ValidatorJSON): void;
    createInstance(json: ValidatorJSON): Validator;
}
//# sourceMappingURL=Validator.d.ts.map