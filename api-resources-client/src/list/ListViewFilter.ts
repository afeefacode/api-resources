import { ApiRequest } from '../api/ApiRequest'
import { BagEntries } from '../bag/Bag'
import { ActionFilter, ActionFilterValueType } from '../filter/ActionFilter'
import { ListViewModel } from './ListViewModel'

export class ListViewFilter {
  private _filter: ActionFilter
  private _model: ListViewModel
  private _value: ActionFilterValueType = null

  constructor (filter: ActionFilter, model: ListViewModel) {
    this._filter = filter
    this._model = model
  }

  public get name (): string {
    return this._filter.name
  }

  public get filter (): ActionFilter {
    return this._filter
  }

  public hasDefaultValue (): boolean {
    return this._filter.hasDefaultValue()
  }

  public get defaultValue (): ActionFilterValueType {
    return this._filter.defaultValue
  }

  public hasDefaultValueSet (): boolean {
    return JSON.stringify(this._value) === JSON.stringify(this.defaultValue)
  }

  public hasOptions (): boolean {
    return this._filter.hasOptions()
  }

  public get options (): unknown[] {
    return this._filter.options
  }

  public hasOptionsRequest (): boolean {
    return this._filter.hasOptionsRequest()
  }

  public createOptionsRequest (): ApiRequest | null {
    return this._filter.createOptionsRequest()
  }

  public get multiple (): boolean {
    return this._filter.multiple
  }

  public get value (): ActionFilterValueType {
    return this._value
  }

  public set value (value: ActionFilterValueType) {
    this.setInternalValue(value, true)
  }

  public setInternalValue (value: ActionFilterValueType, dispatchChange: boolean = false): boolean {
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

  public serialize (): ActionFilterValueType | undefined {
    if (!this.hasDefaultValueSet()) { // don't send default
      return this.serializeValue(this._value)
    }
    return undefined
  }

  /**
   * Serializes a filter value into a stringified query value
   */
  public valueToQuery (value: ActionFilterValueType): string | undefined {
    return this._filter.valueToQuery(value)
  }

  /**
   * Converts a stringified query value into a valid filter value
   */
  public queryToValue (value: string): ActionFilterValueType | undefined {
    return this._filter.queryToValue(value)
  }

  /**
   * Converts a filter value into a serialized form to be used in api requests
   */
  public serializeValue (value: ActionFilterValueType): ActionFilterValueType {
    return this._filter.serializeValue(value)
  }

  /**
   * Converts a given serialized value into a filter value
   * E.g.: 2024-11-07T23:00:00.000000Z -> Date
   */
  public deserializeDefaultValue (value: ActionFilterValueType): ActionFilterValueType {
    return this._filter.deserializeDefaultValue(value)
  }
}
