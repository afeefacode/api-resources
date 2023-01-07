import { FilterMixinConstructor } from './FilterMixinConstructor'

type IntFilterValue = number | null

export function IntFilterMixin<TFilter extends FilterMixinConstructor> (Filter: TFilter): typeof Filter {
  return class IntFilterMixin extends Filter {
    public valueToQuery (value: IntFilterValue): string | undefined {
      if (typeof value === 'number') {
        return Math.floor(value).toString()
      }

      return undefined
    }

    public queryToValue (query: string): IntFilterValue | undefined {
      const number = parseInt(query)
      if (!isNaN(number)) {
        return number
      }

      return undefined
    }
  }
}
