import { FieldJSON } from '../field/Field';
export declare type TypeJSON = {
    fields: Record<string, FieldJSON>;
    update_fields: Record<string, FieldJSON>;
    create_fields: Record<string, FieldJSON>;
};
export declare class Type {
    private _fields;
    private _updateFields;
    private _createFields;
    constructor(json: TypeJSON);
}
//# sourceMappingURL=Type.d.ts.map