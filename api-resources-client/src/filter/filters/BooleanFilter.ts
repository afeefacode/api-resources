import { Filter } from '../Filter'
import { BooleanFilterMixin } from './mixins/BooleanFilterMixin'

export class BooleanFilter extends BooleanFilterMixin(Filter) {
  public static type: string = 'Afeefa.BooleanFilter'
}
