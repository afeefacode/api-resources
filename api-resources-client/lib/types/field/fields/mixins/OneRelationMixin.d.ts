import { Relation } from '../../Relation';
declare type RelationMixinConstructor = new (...args: any[]) => Relation;
export declare function OneRelationMixin<TRelation extends RelationMixinConstructor>(Relation: TRelation): typeof Relation;
export {};
//# sourceMappingURL=OneRelationMixin.d.ts.map