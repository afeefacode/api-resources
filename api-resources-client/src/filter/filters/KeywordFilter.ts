import { Filter } from '../Filter.js'
import { StringFilterMixin } from './mixins/StringFilterMixin.js'

export class KeywordFilter extends StringFilterMixin(Filter) {
  public static type: string = 'Afeefa.KeywordFilter'
}
