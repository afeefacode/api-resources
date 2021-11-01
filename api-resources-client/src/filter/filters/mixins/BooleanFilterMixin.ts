import { FilterMixinConstructor } from './FilterMixinConstructor'

export function BooleanFilterMixin<TFilter extends FilterMixinConstructor> (Filter: TFilter): typeof Filter {
  return class BooleanFilterMixin extends Filter {
    protected valueToQuery (value: unknown): string | undefined {
      if (value === true) {
        return '1'
      }

      if (value === false && this.hasOption(false)) {
        return '0'
      }

      if (value === null && this.nullIsOption) {
        return '0,1'
      }

      return undefined
    }

    protected queryToValue (value: string): boolean | null | undefined {
      if (value === '1') {
        return true
      }

      if (value === '0' && this.hasOption(false)) {
        return false
      }

      if (value === '0,1' && this.nullIsOption) {
        return null
      }

      return undefined
    }

    protected serializeValue (value: boolean): boolean | null | undefined {
      if (value) {
        return value
      }

      if (value === false && this.hasOption(false)) {
        return false
      }

      if (value === null && this.nullIsOption) {
        return null
      }

      return undefined
    }
  }
}
