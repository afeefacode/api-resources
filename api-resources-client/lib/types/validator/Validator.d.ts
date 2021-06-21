import { Rule, RuleJSON } from './Rule';
export declare type ValidatorJSON = {
    type: string;
    rules: Record<string, RuleJSON>;
    params: Record<string, unknown>;
};
export declare type RuleValidator<T> = (value: T) => boolean | string;
export declare class Validator<T = any> {
    protected _rules: Record<string, Rule>;
    protected _params: Record<string, unknown>;
    setupRules(rules: Record<string, RuleJSON>): void;
    createFieldValidator(json: ValidatorJSON): Validator<T>;
    getRules(fieldLabel: string): RuleValidator<T>[];
    getParams(): Record<string, unknown>;
    protected setupParams(params: Record<string, unknown>): void;
    protected createRuleValidator(_fieldLabel: string, _ruleName: string, _rule: Rule, _params: unknown): RuleValidator<T>;
}
//# sourceMappingURL=Validator.d.ts.map