import { Filter } from '../Filter'

type IdFilterValue = string

export class IdFilter extends Filter {
  public static type: string = 'Afeefa.IdFilter'

  protected valueToQuery (value: IdFilterValue): string | undefined {
    if (value) {
      return value
    }
    return undefined
  }

  protected queryToValue (value: string): IdFilterValue | undefined {
    if (value) {
      return value
    }
    return undefined
  }
}
