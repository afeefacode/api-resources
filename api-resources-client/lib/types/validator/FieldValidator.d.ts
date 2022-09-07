import { Rule } from './Rule';
import { RuleValidator, Validator } from './Validator';
export declare type FieldValidatorJSON = {
    type: string;
    params: Record<string, unknown>;
};
export declare class FieldValidator<T = any> {
    private _validator;
    private _params;
    private _additionalRules;
    constructor(validator: Validator<T>, json: FieldValidatorJSON);
    getParams(): Record<string, unknown>;
    param(name: string): unknown;
    getRules(fieldLabel: string): RuleValidator<T>[];
    addRule(validate: RuleValidator<T>): FieldValidator;
    protected createRuleValidator(fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<T>;
}
//# sourceMappingURL=FieldValidator.d.ts.map