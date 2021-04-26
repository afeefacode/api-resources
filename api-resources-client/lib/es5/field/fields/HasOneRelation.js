import { Relation } from '../Relation';
import { OneRelationMixin } from './mixins/OneRelationMixin';
export class HasOneRelation extends OneRelationMixin(Relation) {
}
HasOneRelation.type = 'Afeefa.HasOneRelation';
