import { ApiRequest } from '../api/ApiRequest'
import { BagEntries } from '../bag/Bag'
import { Filter, FilterValueType } from '../filter/Filter'
import { ListViewModel } from './ListViewModel'

export class ListViewFilter {
  private _filter: Filter
  private _model: ListViewModel
  private _value: FilterValueType = null

  constructor (filter: Filter, model: ListViewModel) {
    this._filter = filter
    this._model = model
  }

  public get name (): string {
    return this._filter.name
  }

  public get filter (): Filter {
    return this._filter
  }

  public get defaultValue (): FilterValueType {
    return this._filter.defaultValue
  }

  public hasDefaultValueSet (): boolean {
    return JSON.stringify(this._value) === JSON.stringify(this.defaultValue)
  }

  public get nullIsOption (): boolean {
    return this._filter.nullIsOption
  }

  public hasOptions (): boolean {
    return this._filter.hasOptions()
  }

  public get options (): unknown[] {
    return this._filter.options
  }

  public hasRequest (): boolean {
    return this._filter.hasRequest()
  }

  public get request (): ApiRequest | null {
    return this._filter.request
  }

  public get value (): FilterValueType {
    return this._value
  }

  public set value (value: FilterValueType) {
    this.setInternalValue(value, true)
  }

  public setInternalValue (value: FilterValueType, dispatchChange: boolean = false): boolean {
    const newJson = JSON.stringify(value)
    const oldJson = JSON.stringify(this._value)
    if (newJson !== oldJson) {
      this._value = value
      if (dispatchChange) {
        this._model.filterValueChanged(this.name)
      }
      return true
    }
    return false
  }

  public toQuerySource (): BagEntries<string> {
    if (!this.hasDefaultValueSet()) {
      const valueString = this.valueToQuery(this._value) // value can be represented in query
      if (valueString) {
        return {
          [this.name]: valueString
        }
      }
    }
    return {}
  }

  public reset (): boolean {
    if (!this.hasDefaultValueSet()) {
      this._value = this.defaultValue
      return true
    }
    return false
  }

  public serialize (): FilterValueType | undefined {
    if (!this.hasDefaultValueSet()) { // send only if no default
      let useFilter = true
      if (this._value === null) { // send null only if it's an option
        useFilter = this.nullIsOption
      }
      if (useFilter) {
        return this.serializeValue(this._value)
      }
    }
    return undefined
  }

  /**
   * Serializes a filter value into a stringified query value
   */
  public valueToQuery (value: FilterValueType): string | undefined {
    return this._filter.valueToQuery(value)
  }

  /**
   * Converts a stringified query value into a valid filter value
   */
  public queryToValue (value: string): FilterValueType | undefined {
    return this._filter.queryToValue(value)
  }

  /**
   * Converts a filter value into a serialized form to be used in api requests
   */
  public serializeValue (value: FilterValueType): FilterValueType {
    return this._filter.serializeValue(value)
  }
}
