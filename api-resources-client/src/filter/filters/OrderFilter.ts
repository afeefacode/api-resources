import { Filter } from '../Filter'

type Direction = 'asc' | 'desc'

type OrderFilterValue = Record<string, Direction> | null

export class OrderFilter extends Filter {
  public static type: string = 'Afeefa.OrderFilter'

  public valueToQuery (value: OrderFilterValue): string | undefined {
    let query: string | undefined

    if (value) {
      for (const [field, direction] of Object.entries(value)) {
        query = [field, direction].join('-') // only 1 order possible by now
      }
    }

    return query
  }

  public queryToValue (value: string): OrderFilterValue | undefined {
    if (value) {
      const [field, direction] = value.split('-') as [string, Direction]
      return {
        [field]: direction
      }
    }

    return undefined
  }
}
