export type BagEntries<T> = Record<string, T>

export class Bag<T> {
  private _entries: BagEntries<T> = {}

  public add (name: string, entry: T): Bag<T> {
    this._entries[name] = entry
    return this
  }

  public has (name: string): boolean {
    return this._entries.hasOwnProperty(name)
  }

  public get (name: string): T | null {
    return this._entries[name] || null
  }

  public entries (): [string, T][] {
    return Object.entries(this._entries)
  }

  public values (): T[] {
    return Object.values(this._entries)
  }

  public getEntries (): BagEntries<T> {
    return this._entries
  }
}
