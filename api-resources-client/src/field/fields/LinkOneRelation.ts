import { Relation } from '../Relation'
import { OneRelationMixin } from './mixins/OneRelationMixin'

export class LinkOneRelation extends OneRelationMixin(Relation) {
  public static type: string = 'Afeefa.LinkOneRelation'
}
