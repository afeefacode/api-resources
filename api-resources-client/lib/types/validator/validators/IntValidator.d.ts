import { FieldRule } from '../FieldRule.js';
import { RuleValidator } from '../Validator.js';
import { NumberValidator } from './NumberValidator.js';
export declare class IntValidator extends NumberValidator {
    createRuleValidator(rule: FieldRule): RuleValidator<number | null>;
}
//# sourceMappingURL=IntValidator.d.ts.map