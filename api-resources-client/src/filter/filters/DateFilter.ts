import { ActionFilterValueType } from '../ActionFilter'
import { Filter } from '../Filter'

export class DateFilter extends Filter {
  public static type: string = 'Afeefa.DateFilter'

  public valueToQuery (value: Date | null): string | undefined {
    let query: string | undefined

    if (value) {
      // sv wegen https://stackoverflow.com/a/65758103
      query = value.toLocaleDateString('sv', { year: 'numeric', month: '2-digit', day: '2-digit' })
    }

    return query
  }

  public queryToValue (value: string): Date | undefined {
    if (value) {
      return new Date(value)
    }

    return undefined
  }

  public serializeValue (value: ActionFilterValueType): ActionFilterValueType {
    if (value) {
      value = (value as Date).toLocaleDateString('sv', { year: 'numeric', month: '2-digit', day: '2-digit' })
    }
    return value
  }

  public deserializeDefaultValue (value: ActionFilterValueType): ActionFilterValueType {
    if (value) {
      return this.queryToValue(value as string) as Date
    }
    return null
  }
}
