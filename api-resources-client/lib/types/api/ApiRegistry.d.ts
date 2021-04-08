import '../filter/filters';
import '../validator/validators';
import '../field/fields';
import { Api } from './Api';
declare class ApiRegistry {
    private _apis;
    register(name: string, baseUrl: string): Api;
    get(name: string): Api | null;
}
export declare const apiRegistry: ApiRegistry;
export declare function registerApi(name: string, baseUrl: string): Api;
export declare function getApi(name: string): Api | null;
export {};
//# sourceMappingURL=ApiRegistry.d.ts.map