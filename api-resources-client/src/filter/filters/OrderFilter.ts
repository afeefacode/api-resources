import { Filter, FilterJSON } from '../Filter'

type Direction = 'asc' | 'desc';

type OrderFilterJSON = FilterJSON & {
  fields: {
    [name: string]: Direction[]
  }
}

export class OrderFilter extends Filter {
  public fields: Record<string, Direction[]> = {}

  protected setupParams (json: OrderFilterJSON) {
    if (json.fields) {
      for (const [name, orderJSON] of Object.entries(json.fields)) {
        this.fields[name] = orderJSON
      }
    }
  }
}
