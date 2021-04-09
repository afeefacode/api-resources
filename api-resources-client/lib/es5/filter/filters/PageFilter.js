import { Filter } from '../Filter';
export class PageFilter extends Filter {
    setupParams(json) {
        this.defaultPageSize = json.default_page_size;
        this.pageSizes = json.page_sizes;
    }
}
