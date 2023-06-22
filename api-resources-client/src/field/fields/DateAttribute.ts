import { Attribute } from '../Attribute'

export class DateAttribute extends Attribute {
  public static type: string = 'Afeefa.DateAttribute'

  public deserialize (value: string | null): Date | null {
    if (value) {
      return new Date(value)
    }
    return null
  }
}
