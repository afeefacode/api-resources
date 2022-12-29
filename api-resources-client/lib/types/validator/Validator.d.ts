import { FieldRule } from './FieldRule';
import { FieldSanitizer } from './FieldSanitizer';
import { FieldValidator, FieldValidatorJSON } from './FieldValidator';
import { Rule, RuleJSON } from './Rule';
import { Sanitizer, SanitizerJSON } from './Sanitizer';
export declare type ValidatorJSON = {
    type: string;
    sanitizers?: Record<string, SanitizerJSON>;
    rules: Record<string, RuleJSON>;
};
export declare type RuleValidator<T> = (value: T) => boolean | string;
export declare type SanitizerFunction<T> = (value: T) => T;
export declare class Validator<T = any> {
    protected _rules: Record<string, Rule>;
    protected _sanitizers: Record<string, Sanitizer>;
    setSanitizers(sanitizers?: Record<string, SanitizerJSON>): void;
    setRules(rules: Record<string, RuleJSON>): void;
    createFieldValidator(json: FieldValidatorJSON): FieldValidator<T>;
    getRules(): Record<string, Rule>;
    getSanitizers(): Record<string, Sanitizer>;
    getParamsWithDefaults(fieldParams: Record<string, unknown>): Record<string, unknown>;
    createRuleValidator(rule: FieldRule): RuleValidator<T>;
    createSanitizerFunction(_sanitizer: FieldSanitizer): SanitizerFunction<T>;
    getEmptyValue(_params: Record<string, unknown>): unknown;
    getMaxValueLength(_params: Record<string, unknown>): number | null;
    protected valueIsFilled(value: T): boolean;
}
//# sourceMappingURL=Validator.d.ts.map