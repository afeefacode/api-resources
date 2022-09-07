import { Rule } from '../Rule';
import { RuleValidator, Validator } from '../Validator';
export declare class IntValidator extends Validator<string | number | null> {
    createRuleValidator(fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<string | number | null>;
}
//# sourceMappingURL=IntValidator.d.ts.map