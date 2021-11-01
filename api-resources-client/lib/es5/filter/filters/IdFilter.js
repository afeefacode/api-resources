import { Filter } from '../Filter';
import { StringFilterMixin } from './mixins/StringFilterMixin';
export class IdFilter extends StringFilterMixin(Filter) {
}
IdFilter.type = 'Afeefa.IdFilter';
