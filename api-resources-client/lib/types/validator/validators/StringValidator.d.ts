import { FieldRule } from '../FieldRule.js';
import { FieldSanitizer } from '../FieldSanitizer.js';
import { RuleValidator, SanitizerFunction, Validator } from '../Validator.js';
export declare class StringValidator extends Validator<string | null> {
    createSanitizerFunction(sanitizer: FieldSanitizer): SanitizerFunction<string | null>;
    createRuleValidator(rule: FieldRule): RuleValidator<string | null>;
    getMaxValueLength(params: Record<string, unknown>): number | null;
    /**
     * The pattern arrives the way the server needs it, wrapped in delimiters: '/^a+$/i'.
     * RegExp reads those slashes as characters to match, so they are peeled off here and
     * the flags are kept. A pattern without them is passed through untouched.
     */
    protected toRegExp(pattern: string): RegExp;
}
//# sourceMappingURL=StringValidator.d.ts.map