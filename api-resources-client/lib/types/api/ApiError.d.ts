import { AxiosError } from 'axios';
import { ApiRequest } from './ApiRequest';
export declare type ApiResponseErrorJSON = {
    message: string;
    error_details: string[] | string;
    exception: {
        message: string;
    }[];
};
export declare class ApiError {
    request: ApiRequest;
    error: AxiosError;
    message: string | null;
    detail: string[] | string | null;
    isCancel: boolean;
    constructor(request: ApiRequest, error: AxiosError, isCancel?: boolean);
    private getErrorMessage;
    private getErrorDetail;
}
//# sourceMappingURL=ApiError.d.ts.map