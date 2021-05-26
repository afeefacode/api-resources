import { FieldJSONValue } from './field/Field';
export declare type ModelJSON = {
    [key: string]: FieldJSONValue | undefined;
    type: string;
    id?: string;
};
declare type ModelAttributes = Record<string, unknown>;
export declare class Model {
    [index: string]: unknown;
    static type: string;
    id: string | null;
    type: string;
    static create(json: ModelJSON): Model;
    static createForNew(fields: ModelAttributes): Model;
    constructor(type?: string);
    deserialize(json: ModelJSON): void;
    cloneForEdit(fields?: ModelAttributes): Model;
    serialize(fields?: ModelAttributes): ModelJSON;
}
export {};
//# sourceMappingURL=Model.d.ts.map