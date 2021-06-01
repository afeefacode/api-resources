import { RequestFilters } from './RequestFilters'

class FilterHistory {
  private filters: Record<string, RequestFilters> = {}

  public hasFilters (historyKey: string): boolean {
    return !!this.filters[historyKey]
  }

  public getFilters (historyKey: string): RequestFilters {
    return this.filters[historyKey]!
  }

  public addFilters (historyKey: string, filters: RequestFilters): void {
    this.filters[historyKey] = filters
  }

  public removeFilters (historyKey: string): void {
    delete this.filters[historyKey]
  }
}

export const filterHistory = new FilterHistory()
