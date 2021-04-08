import { Filter, FilterJSON } from '../Filter'

export type BooleanFilterJSON = FilterJSON & {
  values: boolean[]
}

export class BooleanFilter extends Filter {
  public values: boolean[]

  constructor (json: BooleanFilterJSON) {
    super(json)

    this.values = json.values
  }
}
