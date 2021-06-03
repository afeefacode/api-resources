import { BaseFilterSource, QuerySource } from './BaseFilterSource'

export class ObjectFilterSource extends BaseFilterSource {
  public query: QuerySource = {}

  constructor (query: QuerySource) {
    super()
    this.query = query
  }

  public getQuery (): QuerySource {
    return this.query
  }

  public push (query: QuerySource): void {
    this.query = {
      ...query
    }
  }
}
