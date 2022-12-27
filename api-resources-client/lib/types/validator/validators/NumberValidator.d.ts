import { FieldRule } from '../FieldRule';
import { RuleValidator, Validator } from '../Validator';
export declare class NumberValidator extends Validator<number | null> {
    createRuleValidator(rule: FieldRule): RuleValidator<number | null>;
    protected valueIsFilled(value: number | null): boolean;
}
//# sourceMappingURL=NumberValidator.d.ts.map