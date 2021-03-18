import { AxiosResponse } from "axios";
export declare class Resource {
    type: string | null;
    private proxy;
    constructor(type: string);
    list(): Promise<AxiosResponse>;
}
//# sourceMappingURL=Resource.d.ts.map