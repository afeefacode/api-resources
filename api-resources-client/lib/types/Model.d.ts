import { FieldJSONValue } from './field/Field';
export declare type ModelJSON = {
    [key: string]: FieldJSONValue | undefined;
    type: string;
    id?: string | null;
};
declare type ModelAttributes = Record<string, unknown>;
declare type ModelConstructor = {
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
    class: ModelConstructor;
    static create(json: ModelJSON): Model;
    static createForNew(fields?: ModelAttributes): Model;
    constructor(type?: string);
    deserialize(json: ModelJSON): void;
    cloneForEdit(fields?: ModelAttributes): Model;
    serialize(fields?: ModelAttributes): ModelJSON;
    equals(model?: Model): boolean;
}
export {};
//# sourceMappingURL=Model.d.ts.map