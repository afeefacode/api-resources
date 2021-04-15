import { Filter } from '../Filter'

type Direction = 'asc' | 'desc';

type OrderFilterValue = [string, Direction] | undefined

export class OrderFilter extends Filter {
  public static type: string = 'Afeefa.OrderFilter'

  protected valueToQuery (value: OrderFilterValue): string | undefined {
    if (value) {
      return value.join('-')
    }

    return undefined
  }

  protected queryToValue (value: string): OrderFilterValue | undefined {
    if (value) {
      return value.split('-') as OrderFilterValue
    }

    return undefined
  }
}
