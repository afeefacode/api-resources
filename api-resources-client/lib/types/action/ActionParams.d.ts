export type ActionParamJSON = {
    type: string;
    [key: string]: unknown;
};
export declare class ActionParam {
    private _type;
    private _values;
    constructor(json: ActionParamJSON);
    getType(): string;
}
//# sourceMappingURL=ActionParams.d.ts.map