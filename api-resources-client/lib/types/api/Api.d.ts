import { Request } from '../Request';
export declare class Api {
    private _baseUrl;
    private _resources;
    private _types;
    private _validators;
    constructor(baseUrl: string);
    getBaseUrl(): string;
    private loadSchema;
    request(): Request;
}
//# sourceMappingURL=Api.d.ts.map