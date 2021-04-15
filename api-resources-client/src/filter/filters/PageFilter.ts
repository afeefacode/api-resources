import { Filter } from '../Filter'
import { IntFilterMixin } from './mixins/IntFilterMixin'

export class PageFilter extends IntFilterMixin(Filter) {
  public static type: string = 'Afeefa.PageFilter'
}
