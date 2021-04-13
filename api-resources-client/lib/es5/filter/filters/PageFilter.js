import { Filter } from '../Filter';
export class PageFilter extends Filter {
    fromQuerySource(query) {
        this.value.page = parseInt(query.page);
    }
}
PageFilter.type = 'Afeefa.PageFilter';
