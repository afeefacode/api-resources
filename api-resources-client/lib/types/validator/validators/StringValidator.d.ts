import { FieldRule } from '../FieldRule';
import { FieldSanitizer } from '../FieldSanitizer';
import { RuleValidator, SanitizerFunction, Validator } from '../Validator';
export declare class StringValidator extends Validator<string | null> {
    createSanitizerFunction(sanitizer: FieldSanitizer): SanitizerFunction<string | null>;
    createRuleValidator(rule: FieldRule): RuleValidator<string | null>;
    getEmptyValue(params: Record<string, unknown>): unknown;
    getMaxValueLength(params: Record<string, unknown>): number | null;
}
//# sourceMappingURL=StringValidator.d.ts.map