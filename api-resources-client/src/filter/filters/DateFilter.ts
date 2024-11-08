import { ActionFilterValueType } from '../ActionFilter'
import { Filter } from '../Filter'

export class DateFilter extends Filter {
  public static type: string = 'Afeefa.DateFilter'

  public valueToQuery (value: Date | null): string | undefined {
    let query: string | undefined

    if (value) {
      query = value.toISOString()
    }

    return query
  }

  public queryToValue (value: string): Date | undefined {
    if (value) {
      return new Date(value)
    }

    return undefined
  }

  public deserializeDefaultValue (value: ActionFilterValueType): ActionFilterValueType {
    if (value) {
      return this.queryToValue(value as string) as Date
    }
    return null
  }
}
