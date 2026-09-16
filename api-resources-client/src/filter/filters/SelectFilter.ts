import { Filter } from '../Filter.js'
import { StringFilterMixin } from './mixins/StringFilterMixin.js'

export class SelectFilter extends StringFilterMixin(Filter) {
  public static type: string = 'Afeefa.SelectFilter'
}
