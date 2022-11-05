export declare type RuleJSON = {
    message: string;
};
export declare class Rule {
    name: string;
    private _message;
    constructor(name: string, json: RuleJSON);
    getMessage(fieldLabel: string, param: unknown): string;
}
//# sourceMappingURL=Rule.d.ts.map