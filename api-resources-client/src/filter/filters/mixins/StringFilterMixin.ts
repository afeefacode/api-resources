import { FilterMixinConstructor } from './FilterMixinConstructor'

type StringFilterValue = string | null

export function StringFilterMixin<TFilter extends FilterMixinConstructor> (Filter: TFilter): typeof Filter {
  return class StringFilterMixin extends Filter {
    public valueToQuery (value: StringFilterValue): string | undefined {
      if (value) {
        return value
      }

      return undefined
    }

    public queryToValue (query: string): StringFilterValue | undefined {
      if (query) {
        return query
      }

      return undefined
    }
  }
}
