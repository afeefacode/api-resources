import { Filter } from '../Filter'
import { StringFilterMixin } from './mixins/StringFilterMixin'

export class IdFilter extends StringFilterMixin(Filter) {
  public static type: string = 'Afeefa.IdFilter'
}
