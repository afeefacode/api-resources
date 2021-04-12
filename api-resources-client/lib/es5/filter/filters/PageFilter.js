import { Filter } from '../Filter';
export class PageFilter extends Filter {
    fromQuerySource(query) {
        this.value.page = parseInt(query.page);
    }
    toQuerySource() {
        return this.value.page > 1
            ? { page: this.value.page.toString() }
            : {};
    }
}
PageFilter.type = 'Afeefa.PageFilter';
