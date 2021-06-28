import { AxiosError } from 'axios';
import { ApiRequest } from './ApiRequest';
export declare type ApiResponseErrorJSON = {
    message: string;
};
export declare class ApiError {
    request: ApiRequest;
    error: AxiosError;
    message: string;
    constructor(request: ApiRequest, error: AxiosError);
    private getErrorDescription;
}
//# sourceMappingURL=ApiError.d.ts.map