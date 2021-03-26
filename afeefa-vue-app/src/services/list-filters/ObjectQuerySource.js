import { BaseQuerySource } from './BaseQuerySource'

export class ObjectQuerySource extends BaseQuerySource {
  query = null

  constructor (query) {
    super()
    this.query = query
  }

  getQuery () {
    return this.query
  }

  push (query) {
    this.query = {
      ...query
    }
  }
}
