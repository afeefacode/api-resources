import { Filter } from '../Filter';
import { StringFilterMixin } from './mixins/StringFilterMixin';
export class KeywordFilter extends StringFilterMixin(Filter) {
}
KeywordFilter.type = 'Afeefa.KeywordFilter';
