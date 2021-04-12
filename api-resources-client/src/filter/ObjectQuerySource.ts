import { BaseQuerySource, Query } from './BaseQuerySource'

export class ObjectQuerySource extends BaseQuerySource {
  public query: Query = {}

  constructor (query: Query) {
    super()
    this.query = query
  }

  public getQuery (): Query {
    return this.query
  }

  public push (query: Query): void {
    this.query = {
      ...query
    }
  }
}
