import { BagEntries } from '../bag/Bag.js'

export class ListViewFilterSource {
  public getQuery (): BagEntries<string> {
    return {}
  }

  public push (_query: BagEntries<string>): void {
  }
}
