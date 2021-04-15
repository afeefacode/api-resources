import { Filter } from '../Filter'
import { IntFilterMixin } from './mixins/IntFilterMixin'

export class PageSizeFilter extends IntFilterMixin(Filter) {
  public static type: string = 'Afeefa.PageSizeFilter'
}
