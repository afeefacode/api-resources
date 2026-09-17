import { FieldRule } from './FieldRule.js';
import { RuleValidator, SanitizerFunction, Validator } from './Validator.js';
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
    /**
     * Checks a value against all rules of the field and returns the result of the
     * first failing rule, or true if the value passes.
     *
     * getRules() returns the rules as functions for a form framework to call.
     * This runs them directly, for code that does not use one. The return value
     * follows the same contract as a single rule: true, or a message.
     */
    validate(value: T, fieldLabel: string): boolean | string;
    getSanitizers(): SanitizerFunction<T>[];
    addAdditionalRule(rule: RuleValidator<T>): FieldValidator;
    setAdditionalRules(rules: RuleValidator<T>[]): FieldValidator;
    getMaxValueLength(): number | null;
    protected createRuleValidator(rule: FieldRule): RuleValidator<T>;
}
//# sourceMappingURL=FieldValidator.d.ts.map