import { Query } from '../BaseQuerySource'
import { Filter } from '../Filter'

type Value = {
  page: number,
  page_size: number
}

export class PageFilter extends Filter {
  public static type: string = 'Afeefa.PageFilter'

  public value!: Value

  public fromQuerySource (query: Query): void {
    this.value.page = parseInt(query.page)
  }

  public toQuerySource (): Query {
    return this.value.page > 1
      ? { page: this.value.page.toString() }
      : {}
  }
}
