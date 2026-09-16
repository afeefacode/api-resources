import { Filter } from '../Filter.js';
import { StringFilterMixin } from './mixins/StringFilterMixin.js';
export class KeywordFilter extends StringFilterMixin(Filter) {
}
KeywordFilter.type = 'Afeefa.KeywordFilter';
