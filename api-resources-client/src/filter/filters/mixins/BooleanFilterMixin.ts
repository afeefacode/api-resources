import { FilterMixinConstructor } from './FilterMixinConstructor'

type BooleanFilterValue = boolean | null

export function BooleanFilterMixin<TFilter extends FilterMixinConstructor> (Filter: TFilter): typeof Filter {
  return class BooleanFilterMixin extends Filter {
    public valueToQuery (value: BooleanFilterValue): string | undefined {
      if (value === true) {
        return '1'
      }

      if (value === false) {
        return '0'
      }

      if (value === null) {
        return '0,1'
      }

      return undefined
    }

    public queryToValue (query: string): BooleanFilterValue | undefined {
      if (query === '1') {
        return true
      }

      if (query === '0') {
        return false
      }

      if (query === '0,1') {
        return null
      }

      return undefined
    }
  }
}
