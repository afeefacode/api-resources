import { ModelJSON } from 'src/Model';
import { Rule } from '../Rule';
import { RuleValidator, Validator } from '../Validator';
export declare class LinkOneValidator extends Validator<ModelJSON | null> {
    protected createRuleValidator(fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<ModelJSON | null>;
}
//# sourceMappingURL=LinkOneValidator.d.ts.map