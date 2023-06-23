import { FieldJSONValue, FieldValue } from './field/Field';
import { Type } from './type/Type';
export declare type ModelJSON = {
    [key: string]: FieldJSONValue | undefined;
    type: string;
    id?: string | null;
};
declare type ModelAttributes = {
    [key: string]: ModelAttributes | true;
};
export declare type ModelData = {
    [key: string]: FieldValue | undefined;
    type?: string;
    id?: string | null;
};
export declare type ModelConstructor = {
    new (data?: ModelData): Model;
    new (type: string, data?: ModelData): Model;
    type: string;
    getType(): Type;
    fromJson(json: ModelJSON): Model;
    create(data?: ModelData): Model;
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
    /**
     * Deserializes a server response json.
     */
    static fromJson(json: ModelJSON): Model;
    /**
     * Creates a new instance while setting all create fields to a default value.
     */
    static defaults(data?: ModelData): Model;
    constructor(data?: ModelData);
    constructor(type: string, data?: ModelData);
    /**
     * Deletes all model attributes not included in fields.
     */
    withOnly(fields?: ModelAttributes): Model;
    /**
     * Deletes all model attributes included in fields.
     */
    without(fields?: ModelAttributes): Model;
    /**
     * Fills the model.
     */
    fill(data: ModelData): Model;
    /**
     * Returns the Type-instance associated to this model.
     */
    getType(): Type;
    /**
     * Initializes the model with the given json data.
     */
    deserialize(json: ModelJSON): void;
    clone(relationsToClone?: ModelAttributes): Model;
    serialize(fields?: ModelAttributes): ModelJSON;
    equals(model?: Model): boolean;
}
export {};
//# sourceMappingURL=Model.d.ts.map