import { Filter, FilterJSON } from '../Filter'

type Direction = 'asc' | 'desc';

type OrderFilterJSON = FilterJSON & {
  [name: string]: Direction[]
}

export class OrderFilter extends Filter {
  [name: string]: Direction[];

  constructor (json: OrderFilterJSON) {
    super(json)

    for (const [name, orderJSON] of Object.entries(json)) {
      this[name] = orderJSON
    }
  }
}
