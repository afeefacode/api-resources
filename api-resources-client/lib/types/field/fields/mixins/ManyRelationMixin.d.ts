import { Relation } from '../../Relation';
declare type RelationMixinConstructor = new (...args: any[]) => Relation;
export declare function ManyRelationMixin<TRelation extends RelationMixinConstructor>(Relation: TRelation): typeof Relation;
export {};
//# sourceMappingURL=ManyRelationMixin.d.ts.map