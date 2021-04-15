import { Filter } from '../Filter'
import { StringFilterMixin } from './mixins/StringFilterMixin'

export class SelectFilter extends StringFilterMixin(Filter) {
  public static type: string = 'Afeefa.SelectFilter'
}
