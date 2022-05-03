import { FieldJSONValue } from './field/Field';
import { Type } from './type/Type';
export declare type ModelJSON = {
    [key: string]: FieldJSONValue | undefined;
    type: string;
    id?: string | null;
};
declare type ModelAttributes = Record<string, unknown>;
export declare type ModelConstructor = {
    new (): Model;
    type: string;
    create(json: ModelJSON): Model;
    createForNew(fields?: ModelAttributes): Model;
};
export declare class Model {
    [index: string]: unknown;
    static type: string;
    id: string | null;
    type: string;
    _ID: number;
    _original?: Model | null;
    class: ModelConstructor;
    static getType(): Type;
    static create(json: ModelJSON): Model;
    static createForNew(fields?: ModelAttributes): Model;
    constructor(type?: string);
    getType(): Type;
    deserialize(json: ModelJSON): void;
    cloneForEdit(fields?: ModelAttributes): Model;
    serialize(fields?: ModelAttributes): ModelJSON;
    equals(model?: Model): boolean;
}
export {};
//# sourceMappingURL=Model.d.ts.map