import { ApiRequest } from './ApiRequest';
import { ApiResponse } from './ApiResponse';
export declare class BatchApiRequest extends ApiRequest {
    private currentPromise?;
    send(): Promise<ApiResponse | boolean>;
}
//# sourceMappingURL=BatchApiRequest.d.ts.map