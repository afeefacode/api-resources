import { Type } from './Type';
declare class TypeRegistry {
    private _types;
    register(type: string, TypeClass: Type): void;
    get(type: string): Type | null;
}
export declare const typeRegistry: TypeRegistry;
export declare function registerType(typeName: string, type: Type): void;
export declare function getType(typeName: string): Type | null;
export {};
//# sourceMappingURL=TypeRegistry.d.ts.map