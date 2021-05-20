import { Rule, RuleJSON } from './Rule';
export declare type ValidatorJSON = {
    type: string;
    rules: Record<string, RuleJSON>;
    params: Record<string, unknown>;
};
export declare type RuleValidator = (value: unknown) => boolean | string;
export declare class Validator {
    private _rules;
    private _params;
    private _fieldName;
    setupRules(rules: Record<string, RuleJSON>): void;
    createFieldValidator(fieldName: string, json: ValidatorJSON): Validator;
    getRules(): RuleValidator[];
    getParams(): Record<string, unknown>;
    protected setupParams(params: Record<string, unknown>): void;
    protected createRuleValidator(_ruleName: string, _rule: Rule, _params: unknown, _fieldName: string): RuleValidator;
}
//# sourceMappingURL=Validator.d.ts.map