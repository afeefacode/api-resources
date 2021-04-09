import { RuleJSON } from './Rule';
export declare type ValidatorJSON = {
    type: string;
    rules: Record<string, RuleJSON>;
    params: Record<string, unknown>;
};
export declare class Validator {
    private _rules;
    private _params;
    setupRules(rules: Record<string, RuleJSON>): void;
    createFieldValidator(json: ValidatorJSON): Validator;
    protected setupParams(params: Record<string, unknown>): void;
}
//# sourceMappingURL=Validator.d.ts.map