import { Relation } from '../Relation';
import { ManyRelationMixin } from './mixins/ManyRelationMixin';
export class HasManyRelation extends ManyRelationMixin(Relation) {
}
HasManyRelation.type = 'Afeefa.HasManyRelation';
