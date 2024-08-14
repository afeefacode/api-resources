import { FieldRule } from './FieldRule';
import { RuleValidator, SanitizerFunction, Validator } from './Validator';
export type FieldValidatorJSON = {
    type: string;
    params: Record<string, unknown>;
};
export declare class FieldValidator<T = any> {
    private _validator;
    private _params;
    private _additionalRules;
    constructor(validator: Validator<T>, json: FieldValidatorJSON);
    getParams(): Record<string, unknown>;
    getParam(ruleName: string): unknown;
    getRules(fieldLabel: string): RuleValidator<T>[];
    getSanitizers(): SanitizerFunction<T>[];
    addAdditionalRule(rule: RuleValidator<T>): FieldValidator;
    setAdditionalRules(rules: RuleValidator<T>[]): FieldValidator;
    getMaxValueLength(): number | null;
    protected createRuleValidator(rule: FieldRule): RuleValidator<T>;
}
//# sourceMappingURL=FieldValidator.d.ts.map