import { BagEntries } from '../bag/Bag'
import { BaseFilterSource } from './BaseFilterSource'

export class ObjectFilterSource extends BaseFilterSource {
  public query: BagEntries<string> = {}

  constructor (query: BagEntries<string>) {
    super()
    this.query = query
  }

  public getQuery (): BagEntries<string> {
    return this.query
  }

  public push (query: BagEntries<string>): void {
    this.query = {
      ...query
    }
  }
}
