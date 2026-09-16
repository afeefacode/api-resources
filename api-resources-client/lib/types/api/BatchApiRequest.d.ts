import { ApiError } from './ApiError.js';
import { ApiRequest } from './ApiRequest.js';
import { ApiResponse } from './ApiResponse.js';
export declare class BatchApiRequest extends ApiRequest {
    private currentPromise?;
    send(): Promise<ApiResponse | ApiError>;
}
//# sourceMappingURL=BatchApiRequest.d.ts.map