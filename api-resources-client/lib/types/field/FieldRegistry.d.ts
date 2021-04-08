import { Field } from './Field';
declare class FieldRegistry {
    private _fields;
    register(type: string, FieldClass: typeof Field): void;
    get(type: string): typeof Field | null;
}
export declare const fieldRegistry: FieldRegistry;
export declare function registerField(type: string, FieldClass: typeof Field): void;
export declare function getField(type: string): typeof Field | null;
export {};
//# sourceMappingURL=FieldRegistry.d.ts.map