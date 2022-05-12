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
    getField(name: string): Field | null;
    getUpdateFields(): Record<string, Field>;
    getUpdateField(name: string): Field | null;
    getCreateFields(): Record<string, Field>;
    getCreateField(name: string): Field | null;
}
//# sourceMappingURL=Type.d.ts.map