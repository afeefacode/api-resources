import { Rule } from '../Rule';
import { RuleValidator, Validator } from '../Validator';
export declare class StringValidator extends Validator<string | null> {
    createRuleValidator(fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<string | null>;
}
//# sourceMappingURL=StringValidator.d.ts.map