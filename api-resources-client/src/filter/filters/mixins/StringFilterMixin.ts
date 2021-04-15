import { FilterMixinConstructor } from './FilterMixinConstructor'

export function StringFilterMixin<TFilter extends FilterMixinConstructor> (Filter: TFilter): typeof Filter {
  return class StringFilterMixin extends Filter {
    public valueToQuery (value: string): string | undefined {
      if (value || value === '') {
        return value
      }

      return undefined
    }

    public queryToValue (value: string): string | undefined {
      if (value || value === '') {
        return value
      }

      return undefined
    }
  }
}
