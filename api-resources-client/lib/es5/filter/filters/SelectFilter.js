import { Filter } from '../Filter';
import { StringFilterMixin } from './mixins/StringFilterMixin';
export class SelectFilter extends StringFilterMixin(Filter) {
}
SelectFilter.type = 'Afeefa.SelectFilter';
