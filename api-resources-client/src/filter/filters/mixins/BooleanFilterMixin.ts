import { FilterMixinConstructor } from './FilterMixinConstructor'

export function BooleanFilterMixin<TFilter extends FilterMixinConstructor> (Filter: TFilter): typeof Filter {
  return class BooleanFilterMixin extends Filter {
    protected valueToQuery (value: unknown): string | undefined {
      if (value === true) {
        return '1'
      }

      if (value === false && this.options.includes(false)) {
        return '0'
      }

      return undefined
    }

    protected queryToValue (value: string): boolean | undefined {
      if (value === '1') {
        return true
      }

      if (value === '0' && this.options.includes(false)) {
        return false
      }

      return undefined
    }

    protected serializeValue (value: boolean): boolean | undefined {
      if (value) {
        return value
      }

      if (value === false && this.options.includes(false)) {
        return false
      }

      return undefined
    }
  }
}
