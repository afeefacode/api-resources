import { AxiosResponse } from 'axios';
export declare class Client {
    get(url: string): Promise<AxiosResponse>;
    post(url: string, params: Record<string, unknown>): Promise<AxiosResponse>;
}
//# sourceMappingURL=Client.d.ts.map