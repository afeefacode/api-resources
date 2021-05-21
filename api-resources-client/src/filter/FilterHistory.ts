import { Action } from 'src/action/Action'

import { BaseQuerySource } from './BaseQuerySource'
import { RequestFilters } from './RequestFilters'

class FilterHistory {
  private filters: Record<string, RequestFilters> = {}
  private validFilters: Record<string, boolean> = {}

  public createRequestFilters (listId: string, action: Action, querySource: BaseQuerySource): RequestFilters {
    if (!this.filters[listId] || this.validFilters[listId] === false) {
      this.filters[listId] = action.createRequestFilters(querySource)
    }
    return this.filters[listId]!
  }

  public markFiltersValid (listId: string, valid: boolean): void {
    this.validFilters[listId] = valid
  }
}

export const filterHistory = new FilterHistory()
