import { Filter } from '../Filter.js'
import { IntFilterMixin } from './mixins/IntFilterMixin.js'

export class PageSizeFilter extends IntFilterMixin(Filter) {
  public static type: string = 'Afeefa.PageSizeFilter'
}
