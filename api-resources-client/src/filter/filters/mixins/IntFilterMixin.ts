import { FilterMixinConstructor } from './FilterMixinConstructor'

export function IntFilterMixin<TFilter extends FilterMixinConstructor> (Filter: TFilter): typeof Filter {
  return class IntFilterMixin extends Filter {
    public valueToQuery (value: number): string | undefined {
      if (value || value === 0) {
        return value.toString()
      }
      return undefined
    }

    public queryToValue (value: string): number | undefined {
      if (value || value === '0') {
        return parseInt(value)
      }
      return undefined
    }
  }
}
