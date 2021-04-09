export type FilterJSON = {
  type: string
}

export class Filter {
  public createActionFilter (json: FilterJSON): Filter {
    const filter = new (this.constructor as { new (): Filter })()
    filter.setupParams(json)
    return filter
  }

  protected setupParams (_json: FilterJSON) {
    // do something particular to the actual filter
  }
}
