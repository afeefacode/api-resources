import { BaseQuerySource, QuerySource } from './BaseQuerySource'

export class ObjectQuerySource extends BaseQuerySource {
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
