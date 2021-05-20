import { Field, FieldJSON } from '../field/Field';
export declare type TypeJSON = {
    fields: Record<string, FieldJSON>;
    update_fields: Record<string, FieldJSON>;
    create_fields: Record<string, FieldJSON>;
};
export declare class Type {
    name: string;
    private _fields;
    private _updateFields;
    private _createFields;
    constructor(name: string, json: TypeJSON);
    getFields(): Record<string, Field>;
    getUpdateFields(): Record<string, Field>;
    getCreateFields(): Record<string, Field>;
}
//# sourceMappingURL=Type.d.ts.map