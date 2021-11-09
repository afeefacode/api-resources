import { FieldValidator, FieldValidatorJSON } from './FieldValidator';
import { Rule, RuleJSON } from './Rule';
export declare type ValidatorJSON = {
    type: string;
    rules: Record<string, RuleJSON>;
    params: Record<string, unknown>;
};
export declare type RuleValidator<T> = (value: T) => boolean | string;
export declare class Validator<T = any> {
    protected _rules: Record<string, Rule>;
    protected _params: Record<string, unknown>;
    setRules(rules: Record<string, RuleJSON>): void;
    createFieldValidator(json: FieldValidatorJSON): FieldValidator<T>;
    getRules(): Record<string, Rule>;
    createRuleValidator(_fieldLabel: string, _ruleName: string, _rule: Rule, _params: unknown): RuleValidator<T>;
}
//# sourceMappingURL=Validator.d.ts.map