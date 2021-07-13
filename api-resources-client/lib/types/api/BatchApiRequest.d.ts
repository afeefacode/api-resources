import { ApiError } from './ApiError';
import { ApiRequest } from './ApiRequest';
import { ApiResponse } from './ApiResponse';
export declare class BatchApiRequest extends ApiRequest {
    private currentPromise?;
    send(): Promise<ApiResponse | ApiError>;
}
//# sourceMappingURL=BatchApiRequest.d.ts.map