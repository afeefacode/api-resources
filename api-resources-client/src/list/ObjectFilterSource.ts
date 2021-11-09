import { BagEntries } from '../bag/Bag'
import { ListViewFilterSource } from './ListViewFilterSource'

export class ObjectFilterSource extends ListViewFilterSource {
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
