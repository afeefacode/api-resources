export declare type RuleJSON = {
    message: string;
    default?: unknown;
};
export declare class Rule {
    name: string;
    private _message;
    default: unknown;
    constructor(name: string, json: RuleJSON);
    getMessage(fieldLabel: string, param: unknown): string;
}
//# sourceMappingURL=Rule.d.ts.map