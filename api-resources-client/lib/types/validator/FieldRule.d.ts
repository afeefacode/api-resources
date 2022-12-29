import { Rule } from './Rule';
export declare class FieldRule {
    rule: Rule;
    fieldLabel: string;
    private _params;
    constructor(rule: Rule, params: Record<string, unknown>, fieldLabel: string);
    get name(): string;
    get params(): unknown;
    getParams(ruleName?: string): unknown;
    get message(): string;
}
//# sourceMappingURL=FieldRule.d.ts.map