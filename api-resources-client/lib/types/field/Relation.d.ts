import { Field, FieldJSON } from './Field';
declare type RelationJSON = FieldJSON & {
    related_type: string;
};
export declare class Relation extends Field {
    private _relatedType;
    createTypeField(json: RelationJSON): Relation;
}
export {};
//# sourceMappingURL=Relation.d.ts.map