import { Filter } from '../Filter'

type Direction = 'asc' | 'desc';

type OrderFilterValue = Record<string, Direction>

export class OrderFilter extends Filter {
  public static type: string = 'Afeefa.OrderFilter'

  protected valueToQuery (value: OrderFilterValue): string | undefined {
    let query: string | undefined
    if (value) {
      for (const [field, direction] of Object.entries(value)) {
        query = [field, direction].join('-')
      }
    }
    return query
  }

  protected queryToValue (value: string): OrderFilterValue | undefined {
    if (value) {
      const [field, direction] = value.split('-') as [string, Direction]
      return {
        [field]: direction
      }
    }
    return undefined
  }

  protected serializeValue (value: OrderFilterValue): OrderFilterValue | undefined {
    if (value) {
      return value
    }

    return undefined
  }
}
