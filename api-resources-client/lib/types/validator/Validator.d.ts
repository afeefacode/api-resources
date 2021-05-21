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
    protected _fieldName: string;
    setupRules(rules: Record<string, RuleJSON>): void;
    createFieldValidator(fieldName: string, json: ValidatorJSON): Validator<T>;
    getRules(): RuleValidator<T>[];
    getParams(): Record<string, unknown>;
    protected setupParams(params: Record<string, unknown>): void;
    protected createRuleValidator(_ruleName: string, _rule: Rule, _params: unknown): RuleValidator<T>;
}
//# sourceMappingURL=Validator.d.ts.map