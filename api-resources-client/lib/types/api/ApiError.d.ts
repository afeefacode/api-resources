import { AxiosError } from 'axios';
import { ApiRequest } from './ApiRequest';
export declare type ApiResponseErrorJSON = {
    message: string;
    exception: {
        message: string;
    }[];
};
export declare class ApiError {
    request: ApiRequest;
    error: AxiosError;
    message: string | null;
    detail: string | null;
    constructor(request: ApiRequest, error: AxiosError);
    private getErrorDescription;
    private getErrorDetail;
}
//# sourceMappingURL=ApiError.d.ts.map