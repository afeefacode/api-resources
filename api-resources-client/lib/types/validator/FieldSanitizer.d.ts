import { Sanitizer } from './Sanitizer';
export declare class FieldSanitizer {
    sanitizer: Sanitizer;
    private _params;
    constructor(sanitizer: Sanitizer, params: Record<string, unknown>);
    get name(): string;
    get params(): unknown;
    getParams(sanitizerName?: string): unknown;
}
//# sourceMappingURL=FieldSanitizer.d.ts.map