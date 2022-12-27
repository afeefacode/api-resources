import { FieldRule } from './FieldRule';
import { FieldValidator, FieldValidatorJSON } from './FieldValidator';
import { Rule, RuleJSON } from './Rule';
export declare type ValidatorJSON = {
    type: string;
    rules: Record<string, RuleJSON>;
};
export declare type RuleValidator<T> = (value: T) => boolean | string;
export declare class Validator<T = any> {
    protected _rules: Record<string, Rule>;
    setRules(rules: Record<string, RuleJSON>): void;
    createFieldValidator(json: FieldValidatorJSON): FieldValidator<T>;
    getRules(): Record<string, Rule>;
    getParamsWithDefaults(params: Record<string, unknown>): Record<string, unknown>;
    createRuleValidator(rule: FieldRule): RuleValidator<T>;
    getEmptyValue(_params: Record<string, unknown>): unknown;
    getMaxValueLength(_params: Record<string, unknown>): number | null;
    protected valueIsFilled(value: T): boolean;
}
//# sourceMappingURL=Validator.d.ts.map