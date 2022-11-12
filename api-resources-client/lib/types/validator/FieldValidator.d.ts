import { FieldRule } from './FieldRule';
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
    param(ruleName: string): unknown;
    getRules(fieldLabel: string): RuleValidator<T>[];
    addAdditionalRule(rule: RuleValidator<T>): FieldValidator;
    setAdditionalRules(rules: RuleValidator<T>[]): FieldValidator;
    getEmptyValue(): unknown;
    getMaxValueLength(): number | null;
    protected createRuleValidator(rule: FieldRule): RuleValidator<T>;
}
//# sourceMappingURL=FieldValidator.d.ts.map