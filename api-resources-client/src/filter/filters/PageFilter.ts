import { QuerySource } from '../BaseQuerySource'
import { Filter } from '../Filter'

type PageFilterValue = {
  page: number,
  page_size: number
}

type PageQuery = QuerySource & {
  page: string,
  page_size: string
}

export class PageFilter extends Filter {
  public static type: string = 'Afeefa.PageFilter'

  public value!: PageFilterValue

  public fromQuerySource (query: PageQuery): void {
    this.value.page = parseInt(query.page)
  }
}
