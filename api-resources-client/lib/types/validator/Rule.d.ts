export declare type RuleJSON = {
    message: string;
};
export declare class Rule {
    private _message;
    constructor(json: RuleJSON);
    getMessage(fieldLabel: string, param: unknown): string;
}
//# sourceMappingURL=Rule.d.ts.map