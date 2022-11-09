import { FieldRule } from '../FieldRule';
import { RuleValidator } from '../Validator';
import { NumberValidator } from './NumberValidator';
export declare class IntValidator extends NumberValidator {
    createRuleValidator(rule: FieldRule): RuleValidator<number | null>;
}
//# sourceMappingURL=IntValidator.d.ts.map