import { Filter } from '../Filter.js';
import { StringFilterMixin } from './mixins/StringFilterMixin.js';
export class SelectFilter extends StringFilterMixin(Filter) {
}
SelectFilter.type = 'Afeefa.SelectFilter';
