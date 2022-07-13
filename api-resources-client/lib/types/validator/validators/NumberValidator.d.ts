import { Rule } from '../Rule';
import { RuleValidator, Validator } from '../Validator';
export declare class NumberValidator extends Validator<string | number | null> {
    createRuleValidator(fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<string | number | null>;
}
//# sourceMappingURL=NumberValidator.d.ts.map