import { Filter } from '../Filter.js';
import { IntFilterMixin } from './mixins/IntFilterMixin.js';
export class PageFilter extends IntFilterMixin(Filter) {
}
PageFilter.type = 'Afeefa.PageFilter';
