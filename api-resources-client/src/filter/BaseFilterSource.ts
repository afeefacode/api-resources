import { BagEntries } from '../bag/Bag'

export class BaseFilterSource {
  public getQuery (): BagEntries<string> {
    return {}
  }

  public push (_query: BagEntries<string>): void {
  }
}
