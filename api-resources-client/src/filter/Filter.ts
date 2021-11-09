import { Action } from '../action/Action'
import { ActionFilter, ActionFilterJSON, ActionFilterValueType } from './ActionFilter'

type FilterConstructor = {
  new (): Filter,
  type: string
}

export class Filter {
  public get type (): string {
    return (this.constructor as FilterConstructor).type
  }

  public createActionFilter (action: Action, name: string, json: ActionFilterJSON): ActionFilter {
    return new ActionFilter(action, this, name, json)
  }

  /**
   * Serializes a filter value into a stringified query value
   */
  public valueToQuery (_value: ActionFilterValueType): string | undefined {
    return undefined
  }

  /**
   * Converts a stringified query value into a valid filter value
   */
  public queryToValue (_value: string): ActionFilterValueType | undefined {
    return undefined
  }

  /**
   * Converts a filter value into a serialized form to be used in api requests
   */
  public serializeValue (value: ActionFilterValueType): ActionFilterValueType {
    return value
  }
}
