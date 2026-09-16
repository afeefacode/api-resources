import { FieldRule } from '../FieldRule.js';
import { FieldSanitizer } from '../FieldSanitizer.js';
import { RuleValidator, SanitizerFunction, Validator } from '../Validator.js';
export declare class StringValidator extends Validator<string | null> {
    createSanitizerFunction(sanitizer: FieldSanitizer): SanitizerFunction<string | null>;
    createRuleValidator(rule: FieldRule): RuleValidator<string | null>;
    getMaxValueLength(params: Record<string, unknown>): number | null;
}
//# sourceMappingURL=StringValidator.d.ts.map