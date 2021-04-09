import { Filter, FilterJSON } from '../Filter'

export type BooleanFilterJSON = FilterJSON & {
  values: boolean[]
}

export class BooleanFilter extends Filter {
  public values!: boolean[]

  protected setupParams (json: BooleanFilterJSON) {
    this.values = json.values
  }
}
