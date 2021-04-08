import { Validator } from './Validator';
declare class ValidatorRegistry {
    private _validators;
    register(type: string, validator: Validator): void;
    get(type: string): Validator | null;
}
export declare const validatorRegistry: ValidatorRegistry;
export declare function registerValidator(type: string, validator: Validator): void;
export declare function getValidator(type: string): Validator | null;
export {};
//# sourceMappingURL=ValidatorRegistry.d.ts.map