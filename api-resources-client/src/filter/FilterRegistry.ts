import { Filter } from './Filter'

class FilterRegistry {
  private _filters: Record<string, typeof Filter> = {}

  public register (type: string, FilterClass: typeof Filter): void {
    this._filters[type] = FilterClass
  }

  public get (type: string): typeof Filter | null {
    return this._filters[type] || null
  }
}

export const filterRegistry = new FilterRegistry()

export function registerFilter (type: string, FilterClass: typeof Filter): void {
  return filterRegistry.register(type, FilterClass)
}

export function getFilter (type: string): typeof Filter | null {
  return filterRegistry.get(type)
}
