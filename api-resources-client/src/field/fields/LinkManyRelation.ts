import { Relation } from '../Relation'
import { ManyRelationMixin } from './mixins/ManyRelationMixin'

export class LinkManyRelation extends ManyRelationMixin(Relation) {
  public static type: string = 'Afeefa.LinkManyRelation'
}
