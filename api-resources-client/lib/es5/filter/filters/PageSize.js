import { IntAttribute } from '../../field/fields/IntAttribute';
import { Filter } from '../Filter';
import { MultiFilterValue } from '../MultiFilterValue';
// type PageFilterValue = {
//   page: number,
//   page_size: number
// }
// type PageQuery = QuerySource & {
//   page: string,
//   page_size: string
// }
export class PageFilter extends Filter {
    constructor() {
        super(...arguments);
        this._defaultValue = new MultiFilterValue(this);
        this._value = new MultiFilterValue(this);
        this.types = {
            page: IntAttribute.type,
            page_size: IntAttribute.type
        };
        // public get page (): number {
        //   return this._value.value.page.value as number
        // }
        // public set page (page: number): number {
        //   console.log('set page', page)
        //   return this._value.value.page.value = page
        // }
        // public value!: PageFilterValue
        // public fromQuerySource (query: PageQuery): void {
        //   this.value.page = parseInt(query.page)
        // }
    }
}
PageFilter.type = 'Afeefa.PageFilter';
